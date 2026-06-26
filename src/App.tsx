import React, { useState, useEffect, useRef } from "react";
import { DashboardTable } from "./components/DashboardTable";
import { DashboardCharts } from "./components/DashboardCharts";
import { GithubCalendar } from "./components/GithubCalendar";
import { Servico } from "./types";
import { Loader2, AlertCircle, Upload, Play, Clock, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";
import { addMonths, subMonths } from "date-fns";

export default function App() {
  const [data, setData] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nextUpdateSeconds, setNextUpdateSeconds] = useState<number>(60);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusColorMap, setStatusColorMap] = useState<Record<string, string>>({
    "CONCLUÍDO": "#34A853",
    "CONCLUÍDO C/ RESSALVAS": "#4285F4",
    "PENDENTE": "#FBBC04",
    "ATRASADO": "#EA4335"
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date();

  const fetchData = async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const fileNames = [
        "/Serviços.xlsx",
        "/Servi%C3%A7os.xlsx",
        "Serviços.xlsx",
        "Servi%C3%A7os.xlsx",
        "/servicos.xlsx",
        "/Servicos.xlsx"
      ];
      
      for (const fileName of fileNames) {
        try {
          console.log(`Attempting to fetch ${fileName}...`);
          const response = await fetch(fileName);
          const contentType = response.headers.get("content-type") || "";
          console.log(`Response for ${fileName}: Status = ${response.status}, Content-Type = ${contentType}`);
          
          if (response.ok && !contentType.includes("text/html")) {
            console.log(`Successfully fetched ${fileName}. Processing...`);
            await processExcel(await response.arrayBuffer());
            setUsingDemoData(false);
            setLastUpdated(new Date());
            setNextUpdateSeconds(60);
            setError(null);
            return;
          } else {
            console.warn(`Skipped ${fileName}: ok = ${response.ok}, contains text/html = ${contentType.includes("text/html")}`);
          }
        } catch (e) {
          console.warn(`Failed to fetch ${fileName}:`, e);
        }
      }

      throw new Error("Arquivo Excel não encontrado no servidor.");
    } catch (err: any) {
      console.warn("Fetch fallback notice:", err.message || err);
      if (!isBackground) {
        console.warn("Could not load any Excel files from the server. Falling back to built-in demonstration data.");
        loadDemoData();
      } else {
        console.warn("Background auto-refresh failed to reach the server.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
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
        setUsingDemoData(false);
        setLastUpdated(new Date());
        setNextUpdateSeconds(60);
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
        "DATA INICIAL": "22/06/2026",
        "DATA FINAL": "25/06/2026",
        "SERVIÇOS": "CARRINHOS ALVARO",
        "FABRICAÇÃO (RESPONSÁVEL)": "ROBSON/DIEGO",
        "STATUS FABRICAÇÃO": "CONCLUÍDO",
        "PINTURA": "ELETROSTÁTICA/ CARLOS",
        "STATUS PINTURA": "CONCLUÍDO",
        "MÁQUINA": "ROUTER",
        "STATUS MÁQUINA": "CONCLUÍDO",
        "INSTALADOR": "DIEGO",
        "STATUS INSTALAÇÃO": "CONCLUÍDO",
        "OBSERVAÇÕES": "FALTA CLIENTE BUSCAR"
      },
      {
        "DATA INICIAL": "26/06/2026",
        "DATA FINAL": "26/06/2026",
        "SERVIÇOS": "SINDI",
        "FABRICAÇÃO (RESPONSÁVEL)": "ROBSON/ZAIDAN",
        "STATUS FABRICAÇÃO": "CONCLUÍDO",
        "PINTURA": "NÃO TEM PINTURA",
        "STATUS PINTURA": "",
        "MÁQUINA": "ROUTER",
        "STATUS MÁQUINA": "",
        "INSTALADOR": "RONALDO/PEDRO",
        "STATUS INSTALAÇÃO": "CONCLUÍDO",
        "OBSERVAÇÕES": "CLIENTE NAO QUIS INSTALAR A DA CAIXA DAGUA"
      },
      {
        "DATA INICIAL": "25/06/2026",
        "DATA FINAL": "29/06/2026",
        "SERVIÇOS": "CONFIS LOGO LUMINARIA",
        "FABRICAÇÃO (RESPONSÁVEL)": "ROBSON/ELDER",
        "STATUS FABRICAÇÃO": "CONCLUÍDO",
        "PINTURA": "DAVIDSON/ AUTOMOTIVA",
        "STATUS PINTURA": "CONCLUÍDO",
        "MÁQUINA": "ROUTER/LASER",
        "STATUS MÁQUINA": "CONCLUÍDO",
        "INSTALADOR": "PENDENTE",
        "STATUS INSTALAÇÃO": "PENDENTE",
        "OBSERVAÇÕES": "FALTA INSTALAÇÃO"
      },
      {
        "DATA INICIAL": "28/06/2026",
        "DATA FINAL": "28/06/2026",
        "SERVIÇOS": "FELICIO ROCHO PARTE 1",
        "FABRICAÇÃO (RESPONSÁVEL)": "DIEGO/FERNANDO",
        "STATUS FABRICAÇÃO": "CONCLUÍDO",
        "PINTURA": "DAVIDSON/ AUTOMOTIVA",
        "STATUS PINTURA": "CONCLUÍDO",
        "MÁQUINA": "ROUTER/LASER",
        "STATUS MÁQUINA": "CONCLUÍDO",
        "INSTALADOR": "RONALDO/PEDRO",
        "STATUS INSTALAÇÃO": "CONCLUÍDO",
        "OBSERVAÇÕES": "FALTA FAZR LIGAÇÃO ELETRICA AGUARDANDO CLIENTE COM PONTO DE ENERGIA"
      },
      {
        "DATA INICIAL": "29/06/2026",
        "DATA FINAL": "02/07/2026",
        "SERVIÇOS": "AMORA BETIM",
        "FABRICAÇÃO (RESPONSÁVEL)": "ROBSON/ELDER",
        "STATUS FABRICAÇÃO": "CONCLUÍDO",
        "PINTURA": "ELETROSTÁTICA/ CARLOS",
        "STATUS PINTURA": "CONCLUÍDO",
        "MÁQUINA": "ROUTER/LASER",
        "STATUS MÁQUINA": "CONCLUÍDO",
        "INSTALADOR": "BARBA",
        "STATUS INSTALAÇÃO": "CONCLUÍDO",
        "OBSERVAÇÕES": ""
      }
    ];
    setData(demoData);
    setUsingDemoData(true);
    setLastUpdated(new Date());
    setNextUpdateSeconds(60);
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

      const xlsxLib = (XLSX as any).default || XLSX;
      const workbook = xlsxLib.read(buffer, { cellDates: true });
      if (!workbook.SheetNames.length) throw new Error("A planilha está vazia ou é inválida.");

      // 1. Process Status & Colors Sheet ("!")
      const defaultColors: Record<string, string> = {
        "CONCLUÍDO": "#34A853",
        "CONCLUÍDO C/ RESSALVAS": "#4285F4",
        "PENDENTE": "#FBBC04",
        "ATRASADO": "#EA4335"
      };
      
      let parsedColors: Record<string, string> = { ...defaultColors };
      const statusSheet = workbook.Sheets["!"];
      
      if (statusSheet) {
        const statusJson = xlsxLib.utils.sheet_to_json(statusSheet, { defval: "" });
        if (Array.isArray(statusJson) && statusJson.length > 0) {
          const newMap: Record<string, string> = {};
          statusJson.forEach((row: any) => {
            let statusVal = "";
            let corVal = "";
            for (const key in row) {
              const cleanKey = key.trim().toUpperCase();
              if (cleanKey === "STATUS") {
                statusVal = String(row[key]).trim().toUpperCase();
              } else if (cleanKey === "COR" || cleanKey === "COLOR") {
                corVal = String(row[key]).trim();
              }
            }
            if (statusVal && corVal) {
              newMap[statusVal] = corVal;
            }
          });
          if (Object.keys(newMap).length > 0) {
            parsedColors = newMap;
          }
        }
      }
      setStatusColorMap(parsedColors);

      // 2. Process Services Sheet ("Planilha1" or fallback)
      let servicesSheet = workbook.Sheets["Planilha1"];
      if (!servicesSheet) {
        // Fallback to first sheet that is not "!"
        const nonStatusSheetName = workbook.SheetNames.find(name => name !== "!");
        if (nonStatusSheetName) {
          servicesSheet = workbook.Sheets[nonStatusSheetName];
        } else {
          servicesSheet = workbook.Sheets[workbook.SheetNames[0]];
        }
      }

      const jsonData = xlsxLib.utils.sheet_to_json(servicesSheet, { defval: "" });

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.warn("Nenhum dado de serviço encontrado na aba de serviços.");
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
      setLastUpdated(new Date());
      setNextUpdateSeconds(60);
      setError(null);
    } catch (err: any) {
      console.error("Processing error:", err);
      throw new Error(err.message || "Erro ao processar o arquivo Excel.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setNextUpdateSeconds((prev) => {
        if (prev <= 1) {
          fetchData(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
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
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 p-4 min-h-0 overflow-hidden">
        {/* Column 1: Charts + Previous Month Calendar (1/3) */}
        <div className="w-1/3 min-w-0 flex flex-col h-full gap-4 overflow-hidden">
          <div className="h-1/2 min-h-0">
            <DashboardCharts data={data} statusColorMap={statusColorMap} />
          </div>
          <div className="h-1/2 min-h-0">
            <GithubCalendar data={data} months={[subMonths(today, 1)]} statusColorMap={statusColorMap} />
          </div>
        </div>

        {/* Column 2: Current and Next Month Calendar (2/3) */}
        <div className="w-2/3 min-w-0 flex flex-col h-full overflow-hidden">
          <GithubCalendar data={data} months={[today, addMonths(today, 1)]} statusColorMap={statusColorMap} />
        </div>
      </div>
    </main>
  );
}
