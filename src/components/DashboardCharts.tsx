import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Servico } from "../types";

interface Props {
  data: Servico[];
}

export const DashboardCharts: React.FC<Props> = ({ data }) => {
  // Chart 1: STATUS INSTALAÇÃO
  const getStatusCounts = (field: keyof Servico) => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const status = (item[field] as string || "PENDENTE").trim().toUpperCase() || "PENDENTE";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const instalacaoData = getStatusCounts("STATUS INSTALAÇÃO");
  const fabricacaoData = getStatusCounts("STATUS FABRICAÇÃO");

  const COLORS: Record<string, string> = {
    "CONCLUÍDO": "#34A853",
    "EM ANDAMENTO": "#FBBC05",
    "PENDENTE": "#EA4335",
    "AGUARDANDO PROJETO": "#EA4335",
    "AGUARDANDO INSTALAÇÃO": "#FBBC05",
  };

  const getColor = (name: string) => COLORS[name] || "#9CA3AF";

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-3 flex flex-col min-h-0">
        <h3 className="text-sm font-black text-gray-900 mb-2 uppercase text-center tracking-tighter">Status Instalação</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={instalacaoData}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={5}
                dataKey="value"
              >
                {instalacaoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={30} iconSize={12} wrapperStyle={{ fontSize: '10px', fontWeight: '900' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-3 flex flex-col min-h-0">
        <h3 className="text-sm font-black text-gray-900 mb-2 uppercase text-center tracking-tighter">Status Fabricação</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fabricacaoData}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={5}
                dataKey="value"
              >
                {fabricacaoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={30} iconSize={12} wrapperStyle={{ fontSize: '10px', fontWeight: '900' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
