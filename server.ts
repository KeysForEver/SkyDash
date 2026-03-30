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
    
    if (!fs.existsSync(searchDir)) return null;
    
    const files = fs.readdirSync(searchDir);
    const excelFile = files.find(f => f.endsWith(".xlsx"));
    return excelFile ? path.join(searchDir, excelFile) : null;
  };

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/data", (req, res) => {
    try {
      const excelPath = getExcelPath();
      if (!excelPath || !fs.existsSync(excelPath)) {
        return res.status(404).json({ error: "Excel file not found" });
      }
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
