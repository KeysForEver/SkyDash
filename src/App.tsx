import React, { useState, useEffect, useRef } from "react";
import { DashboardTable } from "./components/DashboardTable";
import { DashboardCharts } from "./components/DashboardCharts";
import { GithubCalendar } from "./components/GithubCalendar";
import { Servico } from "./types";
import { Loader2, AlertCircle, Upload, Play } from "lucide-react";
import * as XLSX from "xlsx";

export default function App() {
  const [data, setData] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Try to fetch the Excel file directly from the root
      const response = await fetch("/Serviços.xlsx");
      
      // Check if response is OK AND not an HTML page (common in SPA fallbacks)
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && !contentType.includes("text/html")) {
        await processExcel(await response.arrayBuffer());
        return;
      }

      // Try fallback names
      const fallbackResponse = await fetch("/SERVIÇOS 22.xlsx");
      const fallbackContentType = fallbackResponse.headers.get("content-type");
      
      if (fallbackResponse.ok && fallbackContentType && !fallbackContentType.includes("text/html")) {
        await processExcel(await fallbackResponse.arrayBuffer());
        return;
      }

      throw new Error("Arquivo Excel não encontrado no servidor.");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Arquivo 'Serviços.xlsx' não encontrado. Você pode carregar o arquivo manualmente ou usar dados de demonstração.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setLoading(true);
        const buffer = event.target?.result as ArrayBuffer;
        await processExcel(buffer);
      } catch (err: any) {
        setError(err.message || "Erro ao processar o arquivo enviado.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const loadDemoData = () => {
    const demoData: Servico[] = [
      {
        "DATA": "2026-03-31",
        "SERVIÇOS": "PROJETO DEMO 01",
        "FABRICAÇÃO (RESPONSÁVEL)": "EQUIPE A",
        "STATUS FABRICAÇÃO": "CONCLUÍDO",
        "PINTURA": "ELETROSTÁTICA",
        "STATUS PINTURA": "CONCLUÍDO",
        "MÁQUINA": "ROUTER",
        "STATUS MÁQUINA": "CONCLUÍDO",
        "INSTALADOR": "DIEGO",
        "STATUS INSTALAÇÃO": "CONCLUÍDO",
        "OBSERVAÇÕES": "DADOS DE EXEMPLO"
      },
      {
        "DATA": "2026-04-05",
        "SERVIÇOS": "PROJETO DEMO 02",
        "FABRICAÇÃO (RESPONSÁVEL)": "EQUIPE B",
        "STATUS FABRICAÇÃO": "EM ANDAMENTO",
        "PINTURA": "N/A",
        "STATUS PINTURA": "PENDENTE",
        "MÁQUINA": "LASER",
        "STATUS MÁQUINA": "EM ANDAMENTO",
        "INSTALADOR": "CARLOS",
        "STATUS INSTALAÇÃO": "PENDENTE",
        "OBSERVAÇÕES": "DADOS DE EXEMPLO"
      }
    ];
    setData(demoData);
    setError(null);
  };

  const processExcel = async (buffer: ArrayBuffer) => {
    try {
      // Basic check: if the buffer starts with '<!DOCTYPE' or '<html>', it's HTML
      const decoder = new TextDecoder();
      const preview = decoder.decode(buffer.slice(0, 100));
      if (preview.trim().toLowerCase().startsWith("<!doctype") || preview.trim().toLowerCase().startsWith("<html")) {
        throw new Error("O servidor retornou um arquivo HTML em vez de um Excel.");
      }

      const workbook = XLSX.read(buffer, { cellDates: true });
      if (!workbook.SheetNames.length) throw new Error("A planilha está vazia ou é inválida.");
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.warn("Nenhum dado encontrado na primeira aba da planilha.");
      }

      // Normalize keys
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
    // Auto-update every 5 minutes if data was fetched from server
    const interval = setInterval(() => {
      if (!error && data.length > 0) fetchData();
    }, 5 * 60 * 1000);
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
        <div className="flex flex-col items-center gap-6 text-center max-w-lg p-8">
          <AlertCircle className="w-16 h-16 text-[var(--google-red)]" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Arquivo não encontrado</h1>
            <p className="text-gray-600 leading-relaxed">{error}</p>
          </div>
          
          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[var(--google-blue)] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-100"
            >
              <Upload className="w-5 h-5" />
              Carregar Planilha Manualmente
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".xlsx, .xls" 
              className="hidden" 
            />

            <div className="flex gap-3">
              <button 
                onClick={loadDemoData}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                <Play className="w-5 h-5" />
                Ver Demonstração
              </button>
              
              <button 
                onClick={fetchData}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Tentar Novamente
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Para carregamento automático, coloque o arquivo <code className="bg-gray-100 px-1 rounded">Serviços.xlsx</code> na pasta <code className="bg-gray-100 px-1 rounded">public</code> ou <code className="bg-gray-100 px-1 rounded">dist</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 p-4 min-h-0 overflow-hidden">
        {/* Column 1: Charts (1/3) */}
        <div className="w-1/3 min-w-0 flex flex-col h-full gap-4 overflow-hidden">
          <DashboardCharts data={data} />
        </div>

        {/* Column 2: Calendar (2/3) */}
        <div className="w-2/3 min-w-0 flex flex-col h-full overflow-hidden">
          <GithubCalendar data={data} />
        </div>
      </div>
    </main>
  );
}
