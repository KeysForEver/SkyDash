import React from "react";
import { Servico } from "../types";
import { cn } from "../lib/utils";

interface Props {
  data: Servico[];
}

export const DashboardTable: React.FC<Props> = ({ data }) => {
  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === "CONCLUÍDO") return "text-[var(--google-green)] font-semibold";
    if (s === "EM ANDAMENTO") return "text-[var(--google-yellow)] font-semibold";
    if (s === "PENDENTE" || s === "AGUARDANDO PROJETO") return "text-[var(--google-red)] font-semibold";
    return "text-gray-500";
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col border border-gray-200 rounded-xl shadow-sm bg-white">
      <div className="bg-gray-50 border-b border-gray-200 px-20 py-16">
        <h2 className="text-7xl font-black uppercase tracking-tighter text-gray-900">Tabela de Serviços</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr>
              <th className="px-20 py-16 font-black text-gray-600 uppercase text-4xl border-b">Serviços</th>
              <th className="px-20 py-16 font-black text-gray-600 uppercase text-4xl border-b">Fabricação</th>
              <th className="px-20 py-16 font-black text-gray-600 uppercase text-4xl border-b">Instalação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-20 py-16 font-black text-gray-900 text-5xl leading-tight">{item.SERVIÇOS}</td>
                <td className={cn("px-20 py-16 text-5xl font-black", getStatusColor(item["STATUS FABRICAÇÃO"]))}>
                  {item["STATUS FABRICAÇÃO"]}
                </td>
                <td className={cn("px-20 py-16 text-5xl font-black", getStatusColor(item["STATUS INSTALAÇÃO"]))}>
                  {item["STATUS INSTALAÇÃO"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
