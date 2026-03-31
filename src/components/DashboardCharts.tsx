import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Servico } from "../types";

interface Props {
  data: Servico[];
}

export const DashboardCharts: React.FC<Props> = ({ data }) => {
  // Chart 1: STATUS INSTALAÇÃO
  const getStatusCounts = (field: string) => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const status = (item[field as keyof Servico] as string || "PENDENTE").trim().toUpperCase() || "PENDENTE";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const instalacaoData = getStatusCounts("STATUS INSTALAÇÃO");
  const fabricacaoData = getStatusCounts("STATUS FABRICAÇÃO");

  const getChartColors = (chartData: { name: string; value: number }[]) => {
    const SEMANTIC: Record<string, string> = {
      "CONCLUÍDO": "#34A853", // Google Green
      "ATRASADO": "#EA4335",  // Google Red
      "CANCELADO": "#70757a", // Gray
    };

    const PALETTE = [
      "#4285F4", // Google Blue
      "#FBBC05", // Google Yellow
      "#A142F4", // Google Purple
      "#24C1E0", // Google Cyan
      "#FA7B17", // Google Orange
      "#F06292", // Pink
      "#009688", // Teal
      "#3F51B5", // Indigo
      "#FF5722", // Deep Orange
      "#607D8B", // Blue Gray
    ];

    // Filter palette to remove colors used in semantic mapping to prevent duplicates
    const semanticValues = new Set(Object.values(SEMANTIC));
    const availablePalette = PALETTE.filter(c => !semanticValues.has(c));

    let paletteIdx = 0;
    return chartData.map(item => {
      const name = item.name.toUpperCase().trim();
      if (SEMANTIC[name]) return SEMANTIC[name];
      return availablePalette[paletteIdx++ % availablePalette.length];
    });
  };

  const instalacaoColors = getChartColors(instalacaoData);
  const fabricacaoColors = getChartColors(fabricacaoData);

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
                {instalacaoData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={instalacaoColors[index]} />
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
                {fabricacaoData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={fabricacaoColors[index]} />
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
