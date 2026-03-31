import React from "react";
import { Servico } from "../types";
import { cn } from "../lib/utils";

interface Props {
  data: Servico[];
}

export const DashboardTable: React.FC<Props> = ({ data }) => {
  const getStatusColor = (status: string | undefined) => {
    const s = (status || "").trim().toUpperCase();
    if (s === "CONCLUÍDO") return "text-[var(--google-green)] font-semibold";
    if (s === "EM ANDAMENTO" || s === "PENDENTE" || s.includes("AGUARDANDO")) return "text-[var(--google-yellow)] font-semibold";
    if (s === "ATRASADO") return "text-[var(--google-red)] font-semibold";
    return "text-gray-500";
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col border border-gray-200 rounded-xl shadow-sm bg-white">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50 shadow-sm z-10">
            <tr>
              <th className="px-3 py-3 font-black text-gray-700 uppercase text-xs border-b">Serviços</th>
              <th className="px-3 py-3 font-black text-gray-700 uppercase text-xs border-b">Status Fab.</th>
              <th className="px-3 py-3 font-black text-gray-700 uppercase text-xs border-b">Status Inst.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-8 text-center text-gray-400 font-medium italic">
                  Nenhum dado encontrado.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-bold text-gray-900 text-xs leading-tight truncate max-w-[200px]">{item.SERVIÇOS || "-"}</td>
                  <td className={cn("px-3 py-2 text-xs font-bold truncate", getStatusColor(item["STATUS FABRICAÇÃO"]))}>
                    {item["STATUS FABRICAÇÃO"] || "PENDENTE"}
                  </td>
                  <td className={cn("px-3 py-2 text-xs font-bold truncate", getStatusColor(item["STATUS INSTALAÇÃO"]))}>
                    {item["STATUS INSTALAÇÃO"] || "PENDENTE"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
