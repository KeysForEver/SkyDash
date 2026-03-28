import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Servico } from "../types";

interface Props {
  data: Servico[];
}

export const DashboardCharts: React.FC<Props> = ({ data }) => {
  // Chart 1: STATUS INSTALAÇÃO (Pendente vs Concluído)
  const instalacaoData = [
    { name: "Pendente", value: data.filter(s => s["STATUS INSTALAÇÃO"].toUpperCase() === "PENDENTE").length },
    { name: "Concluído", value: data.filter(s => s["STATUS INSTALAÇÃO"].toUpperCase() === "CONCLUÍDO").length },
    { name: "Em Andamento", value: data.filter(s => s["STATUS INSTALAÇÃO"].toUpperCase() === "EM ANDAMENTO").length },
  ].filter(d => d.value > 0);

  // Chart 2: AGUARDANDO PROJETO (FABRICAÇÃO) vs EM ANDAMENTO (INSTALAÇÃO)
  const comparativoData = [
    { name: "Aguardando Projeto", value: data.filter(s => s["STATUS FABRICAÇÃO"].toUpperCase() === "AGUARDANDO PROJETO").length },
    { name: "Em Andamento (Inst.)", value: data.filter(s => s["STATUS INSTALAÇÃO"].toUpperCase() === "EM ANDAMENTO").length },
  ].filter(d => d.value > 0);

  const COLORS = {
    "Pendente": "#EA4335",
    "Concluído": "#34A853",
    "Em Andamento": "#FBBC05",
    "Aguardando Projeto": "#EA4335",
    "Em Andamento (Inst.)": "#FBBC05",
  };

  return (
    <div className="h-full flex flex-col gap-20">
      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-20 flex flex-col min-h-0">
        <h3 className="text-7xl font-black text-gray-900 mb-20 uppercase text-center tracking-tighter">Status Instalação</h3>
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
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={150} iconSize={64} wrapperStyle={{ fontSize: '64px', fontWeight: '900' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-20 flex flex-col min-h-0">
        <h3 className="text-7xl font-black text-gray-900 mb-20 uppercase text-center tracking-tighter">Aguardando vs Em Andamento</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={comparativoData}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={5}
                dataKey="value"
              >
                {comparativoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={150} iconSize={64} wrapperStyle={{ fontSize: '64px', fontWeight: '900' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
