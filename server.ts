import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

// SheetJS ESM compatibility
const { readFile, utils, writeFile, set_fs } = (XLSX as any).default || XLSX;
if (set_fs) set_fs(fs);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure the Excel file exists for demonstration
  const excelPath = path.join(process.cwd(), "SERVIÇOS 22.xlsx");
  if (!fs.existsSync(excelPath)) {
    const wb = utils.book_new();
    const data = [
      ["SERVIÇOS", "STATUS FABRICAÇÃO", "STATUS INSTALAÇÃO", "DATA INSTALAÇÃO"],
      ["Cozinha Planejada", "CONCLUÍDO", "CONCLUÍDO", "2026-03-20"],
      ["Armário Quarto", "EM ANDAMENTO", "PENDENTE", "2026-03-28"],
      ["Painel TV", "AGUARDANDO PROJETO", "PENDENTE", "2026-04-05"],
      ["Mesa Escritório", "CONCLUÍDO", "EM ANDAMENTO", "2026-03-25"],
      ["Prateleiras", "EM ANDAMENTO", "PENDENTE", "2026-03-15"], // Atrasado
      ["Balcão Banheiro", "CONCLUÍDO", "CONCLUÍDO", "2026-02-10"],
      ["Closet", "AGUARDANDO PROJETO", "PENDENTE", "2026-05-01"],
    ];
    const ws = utils.aoa_to_sheet(data);
    utils.book_append_sheet(wb, ws, "Serviços");
    writeFile(wb, excelPath);
  }

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/data", (req, res) => {
    try {
      const workbook = readFile(excelPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);
      res.json(jsonData);
    } catch (error) {
      console.error("Error reading Excel:", error);
      res.status(500).json({ error: "Failed to read Excel file" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
