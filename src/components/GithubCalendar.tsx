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
    subMonths(today, 1),
    today,
    addMonths(today, 1)
  ];

  const getDayStatus = (date: Date) => {
    const servicesOnDay = data.filter(item => {
      if (!item["DATA INSTALAÇÃO"]) return false;
      // Simple date parsing for "YYYY-MM-DD" or similar
      const itemDate = new Date(item["DATA INSTALAÇÃO"]);
      return isSameDay(itemDate, date);
    });

    if (servicesOnDay.length === 0) return null;

    const statuses = servicesOnDay.map(s => (s["STATUS INSTALAÇÃO"] || "").toUpperCase().trim());
    
    if (statuses.every(s => s === "CONCLUÍDO")) return "bg-[var(--google-green)]";
    if (statuses.some(s => s === "EM ANDAMENTO")) return "bg-[var(--google-yellow)]";
    return "bg-[var(--google-red)]";
  };

  const renderMonth = (monthDate: Date) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    
    // To align correctly in a grid, we might need padding days from start of week
    const calendarStart = startOfWeek(start, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(end, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div key={monthDate.toISOString()} className="flex flex-col gap-1 bg-gray-50/50 p-2 rounded-lg">
        <h4 className="text-[11px] font-black text-gray-500 uppercase mb-2 border-b border-gray-200 pb-1 flex justify-between items-center">
          <span>{format(monthDate, "MMMM", { locale: ptBR })}</span>
          <span className="text-[9px] opacity-60">{format(monthDate, "yyyy")}</span>
        </h4>
        <div className="grid grid-cols-7 gap-1">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, idx) => (
            <div key={idx} className="w-5 h-5 flex items-center justify-center text-[9px] font-black text-gray-400">{d}</div>
          ))}
          {allDays.map((day, i) => {
            const isCurrentMonth = day.getMonth() === monthDate.getMonth();
            const statusClass = isCurrentMonth ? getDayStatus(day) : null;
            
            return (
              <div
                key={i}
                className={cn(
                  "w-5 h-5 rounded-sm transition-all duration-300 flex items-center justify-center text-[8px] font-bold",
                  !isCurrentMonth ? "opacity-0 pointer-events-none" : (statusClass || "bg-white border border-gray-100 text-gray-300")
                )}
                title={isCurrentMonth ? format(day, "dd/MM/yyyy") : ""}
              >
                {isCurrentMonth && day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 scrollbar-hide">
        {months.map(renderMonth)}
      </div>
    </div>
  );
};
