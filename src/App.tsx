import React, { useState, useEffect } from "react";
import { DashboardTable } from "./components/DashboardTable";
import { DashboardCharts } from "./components/DashboardCharts";
import { GithubCalendar } from "./components/GithubCalendar";
import { Servico } from "./types";
import { Loader2, AlertCircle } from "lucide-react";

export default function App() {
  const [data, setData] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/data");
      if (!response.ok) throw new Error("Falha ao carregar dados");
      const jsonData = await response.json();
      setData(jsonData);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Erro ao carregar os dados da planilha.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-update every 1 minute
    const interval = setInterval(fetchData, 1 * 60 * 1000);
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
