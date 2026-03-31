import React, { useState, useEffect } from "react";
import { DashboardTable } from "./components/DashboardTable";
import { DashboardCharts } from "./components/DashboardCharts";
import { GithubCalendar } from "./components/GithubCalendar";
import { Servico } from "./types";
import { Loader2, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";

export default function App() {
  const [data, setData] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Try to fetch the Excel file directly from the root
      // The user should place the file in the public folder or dist folder
      const response = await fetch("/Serviços.xlsx");
      
      // Check if response is OK AND not an HTML page (common in SPA fallbacks)
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && !contentType.includes("text/html")) {
        return await processExcel(await response.arrayBuffer());
      }

      // Try fallback names if the first one fails or returns HTML
      const fallbackResponse = await fetch("/SERVIÇOS 22.xlsx");
      const fallbackContentType = fallbackResponse.headers.get("content-type");
      
      if (fallbackResponse.ok && fallbackContentType && !fallbackContentType.includes("text/html")) {
        return await processExcel(await fallbackResponse.arrayBuffer());
      }

      throw new Error("Arquivo Excel não encontrado ou o servidor retornou uma página HTML em vez do arquivo.");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Erro ao carregar os dados da planilha. Verifique se o arquivo 'Serviços.xlsx' está na pasta dist.");
    } finally {
      setLoading(false);
    }
  };

  const processExcel = async (buffer: ArrayBuffer) => {
    try {
      // Basic check: if the buffer starts with '<!DOCTYPE' or '<html>', it's HTML
      const decoder = new TextDecoder();
      const preview = decoder.decode(buffer.slice(0, 100));
      if (preview.trim().toLowerCase().startsWith("<!doctype") || preview.trim().toLowerCase().startsWith("<html")) {
        throw new Error("O servidor retornou um arquivo HTML em vez de um Excel. Verifique se o arquivo existe na pasta.");
      }

      const workbook = XLSX.read(buffer, { cellDates: true });
      if (!workbook.SheetNames.length) throw new Error("A planilha está vazia ou é inválida.");
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.warn("Nenhum dado encontrado na primeira aba da planilha.");
      }

      // Normalize keys (same logic as the server had)
      const normalizedData = jsonData.map((row: any) => {
        const newRow: any = {};
        for (const key in row) {
          const cleanKey = key.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
                              .trim()
                              .replace(/\s+/g, ' ');
          newRow[cleanKey] = row[key];
        }
        return newRow;
      });

      setData(normalizedData as Servico[]);
      setError(null);
    } catch (err: any) {
      console.error("Processing error:", err);
      throw new Error(err.message || "Erro ao processar o arquivo Excel.");
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-update every 5 minutes (less frequent for direct file fetch)
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--google-blue)]" />
          <p className="text-xl font-semibold text-gray-600">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-[var(--google-red)]" />
          <h1 className="text-2xl font-bold text-gray-800">Ops! Algo deu errado</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-[var(--google-blue)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 p-4 min-h-0 overflow-hidden">
        {/* Column 1: Table (1/3) */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
          <DashboardTable data={data} />
        </div>

        {/* Column 2: Charts (1/3) */}
        <div className="flex-1 min-w-0 flex flex-col h-full gap-4 overflow-hidden">
          <DashboardCharts data={data} />
        </div>

        {/* Column 3: Calendar (1/3) */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
          <GithubCalendar data={data} />
        </div>
      </div>
    </main>
  );
}
