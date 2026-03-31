import React from "react";
import { Servico } from "../types";
import { cn } from "../lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  data: Servico[];
}

export const GithubCalendar: React.FC<Props> = ({ data }) => {
  const today = new Date();
  const months = [
    today,
    addMonths(today, 1)
  ];

  const getServicesOnDay = (date: Date) => {
    return data.filter(item => {
      const dateVal = item["DATA INSTALAÇÃO"] || item["DATA"];
      if (!dateVal) return false;
      
      let itemDate: Date | null = null;

      if (dateVal instanceof Date) {
        itemDate = dateVal;
      } else if (typeof dateVal === "number") {
        const excelEpoch = new Date(1899, 11, 30);
        itemDate = new Date(excelEpoch.getTime() + dateVal * 86400000);
      } else if (typeof dateVal === "string" && dateVal.includes("/")) {
        const parts = dateVal.split("/");
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          itemDate = new Date(year, month - 1, day);
        }
      }

      if (!itemDate || isNaN(itemDate.getTime())) {
        itemDate = new Date(dateVal);
      }
      
      return isSameDay(itemDate, date);
    });
  };

  const getDayStatusColor = (services: Servico[]) => {
    if (services.length === 0) return null;

    const statuses = services.map(s => (s["STATUS INSTALAÇÃO"] || "").toUpperCase().trim());
    
    if (statuses.some(s => s === "ATRASADO")) return "bg-[var(--google-red)] text-white";
    if (statuses.some(s => s === "PENDENTE" || s === "EM ANDAMENTO" || s.includes("AGUARDANDO"))) return "bg-[var(--google-yellow)] text-gray-900";
    if (statuses.every(s => s === "CONCLUÍDO")) return "bg-[var(--google-green)] text-white";
    
    return "bg-[var(--google-red)] text-white";
  };

  const renderMonth = (monthDate: Date) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    
    const calendarStart = startOfWeek(start, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(end, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div key={monthDate.toISOString()} className="flex-1 flex flex-col bg-white p-2 rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-0">
        <h4 className="text-lg font-black text-gray-800 uppercase mb-2 border-b-2 border-gray-100 pb-1 flex justify-between items-center shrink-0">
          <span>{format(monthDate, "MMMM", { locale: ptBR })}</span>
          <span className="text-sm opacity-40 font-bold">{format(monthDate, "yyyy")}</span>
        </h4>
        <div className="flex-1 grid grid-cols-7 gap-1 min-h-0">
          {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((d, idx) => (
            <div key={idx} className="flex items-center justify-center text-[10px] font-black text-gray-400 pb-1">{d}</div>
          ))}
          {allDays.map((day, i) => {
            const isCurrentMonth = day.getMonth() === monthDate.getMonth();
            const isToday = isSameDay(day, today);
            const services = isCurrentMonth ? getServicesOnDay(day) : [];
            const statusClass = isCurrentMonth ? getDayStatusColor(services) : null;
            
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg transition-all duration-300 flex flex-col p-1 min-h-0 overflow-hidden border",
                  !isCurrentMonth ? "opacity-0 pointer-events-none" : (statusClass || "bg-gray-50 border-gray-100 text-gray-400"),
                  isToday && "border-red-600 border-2 z-20 shadow-md ring-1 ring-red-600/20"
                )}
              >
                <span className="text-[10px] font-black shrink-0 mb-0.5">{isCurrentMonth && day.getDate()}</span>
                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1.5">
                  {services.map((s, sIdx) => (
                    <div 
                      key={sIdx} 
                      className="text-[7px] leading-[1.2] font-bold uppercase break-words bg-white/20 px-0.5 rounded"
                      title={s.SERVIÇOS}
                    >
                      {s.SERVIÇOS}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 h-full">
        {months.map(renderMonth)}
      </div>
    </div>
  );
};
