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

  // Helper to find any .xlsx file in the public or dist directory
  const getExcelPath = () => {
    const searchDir = process.env.NODE_ENV === "production" 
      ? path.join(process.cwd(), "dist")
      : path.join(process.cwd(), "public");
    
    if (!fs.existsSync(searchDir)) {
      fs.mkdirSync(searchDir, { recursive: true });
    }
    
    const files = fs.readdirSync(searchDir);
    console.log("Files in search directory:", files);
    
    // Prioritize "Serviços.xlsx" or "SERVIÇOS.xlsx"
    let excelFile = files.find(f => f.toLowerCase() === "serviços.xlsx");
    if (!excelFile) {
      excelFile = files.find(f => f.toLowerCase().includes("serviços") && f.endsWith(".xlsx"));
    }
    if (!excelFile) {
      excelFile = files.find(f => f.endsWith(".xlsx"));
    }
    
    if (!excelFile && process.env.NODE_ENV !== "production") {
      const defaultPath = path.join(searchDir, "SERVIÇOS 22.xlsx");
      const wb = utils.book_new();
      const data = [
        ["DATA", "SERVIÇOS", "FABRICAÇÃO (RESPONSÁVEL)", "STATUS FABRICAÇÃO", "PINTURA", "STATUS PINTURA", "MÁQUINA", "STATUS MÁQUINA", "INSTALADOR", "STATUS INSTALAÇÃO", "OBSERVAÇÕES"],
        ["01/03/2026", "CARRINHOS ALVARO", "ROBSON/DIEGO", "CONCLUÍDO", "ELETROSTÁTICA/ CARLOS", "CONCLUÍDO", "ROUTER", "CONCLUÍDO", "DIEGO", "CONCLUÍDO", "FALTA CLIENTE BUSCAR"],
      ];
      const ws = utils.aoa_to_sheet(data);
      utils.book_append_sheet(wb, ws, "Serviços");
      writeFile(wb, defaultPath);
      return defaultPath;
    }
    
    return excelFile ? path.join(searchDir, excelFile) : null;
  };

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/data", (req, res) => {
    try {
      const excelPath = getExcelPath();
      if (!excelPath || !fs.existsSync(excelPath)) {
        console.log("Excel file not found at path:", excelPath);
        return res.status(404).json({ error: "Excel file not found" });
      }
      
      console.log("Reading Excel file from:", excelPath);
      const workbook = readFile(excelPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = utils.sheet_to_json(worksheet, { defval: "" });
      
      // Normalize keys by trimming spaces and removing potential hidden characters
      const normalizedData = jsonData.map((row: any) => {
        const newRow: any = {};
        for (const key in row) {
          const cleanKey = key.trim().replace(/\s+/g, ' ');
          newRow[cleanKey] = row[key];
        }
        return newRow;
      });
      
      console.log(`Loaded ${normalizedData.length} rows from Excel.`);
      res.json(normalizedData);
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
