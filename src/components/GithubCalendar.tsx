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
      const dateVal = item["DATA INSTALAÇÃO"] || item["DATA"];
      if (!dateVal) return false;
      
      let itemDate: Date;
      if (typeof dateVal === "string" && dateVal.includes("/")) {
        // Handle DD/MM/YYYY
        const parts = dateVal.split("/");
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          itemDate = new Date(year, month - 1, day);
        } else {
          itemDate = new Date(dateVal);
        }
      } else {
        itemDate = new Date(dateVal);
      }
      
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
    
    const calendarStart = startOfWeek(start, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(end, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div key={monthDate.toISOString()} className="flex-1 flex flex-col bg-gray-50/50 p-[2%] rounded-xl border border-gray-100 overflow-hidden min-h-0">
        <h4 className="text-[min(1.5vh,14px)] font-black text-gray-700 uppercase mb-[1%] border-b border-gray-200 pb-[0.5%] flex justify-between items-center shrink-0">
          <span>{format(monthDate, "MMMM", { locale: ptBR })}</span>
          <span className="text-[min(1vh,10px)] opacity-60 font-bold">{format(monthDate, "yyyy")}</span>
        </h4>
        <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-[1%] min-h-0">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, idx) => (
            <div key={idx} className="flex items-center justify-center text-[min(1.2vh,11px)] font-black text-gray-400">{d}</div>
          ))}
          {allDays.map((day, i) => {
            const isCurrentMonth = day.getMonth() === monthDate.getMonth();
            const statusClass = isCurrentMonth ? getDayStatus(day) : null;
            
            return (
              <div
                key={i}
                className={cn(
                  "rounded-sm transition-all duration-300 flex items-center justify-center text-[min(1.3vh,12px)] font-black shadow-sm h-full w-full",
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
    <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-[2%] flex flex-col overflow-hidden h-full">
      <div className="flex-1 grid grid-rows-3 gap-[2%] min-h-0 h-full">
        {months.map(renderMonth)}
      </div>
    </div>
  );
};
