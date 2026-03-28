import React from "react";
import { format, addMonths, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isBefore, parseISO, startOfWeek, endOfWeek, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Servico } from "../types";

interface Props {
  data: Servico[];
}

export const GithubCalendar: React.FC<Props> = ({ data }) => {
  const today = new Date();
  const startDate = startOfMonth(subMonths(today, 1));
  const endDate = endOfMonth(addMonths(today, 1));

  const getDayStatus = (day: Date) => {
    const servicesOnDay = data.filter(s => {
      if (!s["DATA INSTALAÇÃO"]) return false;
      const serviceDate = parseISO(s["DATA INSTALAÇÃO"]);
      return isSameDay(serviceDate, day);
    });

    if (servicesOnDay.length === 0) return "bg-gray-50 text-gray-400";

    const hasLate = servicesOnDay.some(s => 
      s["STATUS INSTALAÇÃO"].toUpperCase() === "PENDENTE" && isBefore(parseISO(s["DATA INSTALAÇÃO"]), today)
    );
    const hasInProgress = servicesOnDay.some(s => 
      s["STATUS INSTALAÇÃO"].toUpperCase() === "EM ANDAMENTO" || 
      (s["STATUS INSTALAÇÃO"].toUpperCase() === "PENDENTE" && !isBefore(parseISO(s["DATA INSTALAÇÃO"]), today))
    );
    const allDone = servicesOnDay.every(s => s["STATUS INSTALAÇÃO"].toUpperCase() === "CONCLUÍDO");

    if (hasLate) return "bg-[var(--google-red)] text-white";
    if (allDone) return "bg-[var(--google-green)] text-white";
    if (hasInProgress) return "bg-[var(--google-yellow)] text-gray-800";
    
    return "bg-gray-300 text-gray-600";
  };

  const months = [];
  let current = startDate;
  while (isBefore(current, endDate)) {
    months.push(current);
    current = addMonths(current, 1);
  }

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div className="h-full bg-white border border-gray-200 rounded-xl shadow-sm p-3 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 grid grid-rows-3 gap-4 min-h-0">
        {months.map((month, mIdx) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const calendarStart = startOfWeek(monthStart, { locale: ptBR });
          const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
          
          const calendarDays = eachDayOfInterval({
            start: calendarStart,
            end: calendarEnd
          });

          return (
            <div key={mIdx} className="flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-between items-end px-1 mb-1 border-b border-gray-100 pb-1 shrink-0">
                <span className="text-[10px] uppercase font-black text-gray-400 leading-none">
                  {format(month, "MMMM", { locale: ptBR })}
                </span>
                <div className="flex gap-0.5">
                  {weekDays.map((d, i) => (
                    <span key={i} className="w-4 text-[7px] text-center font-bold text-gray-300">{d}</span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-0.5 flex-1 min-h-0">
                {calendarDays.map((day, dIdx) => {
                  const isCurrentMonth = isSameMonth(day, month);
                  const isToday = isSameDay(day, today);
                  
                  return (
                    <div
                      key={dIdx}
                      className={`
                        h-full flex items-center justify-center rounded-sm text-[9px] font-bold transition-all
                        ${!isCurrentMonth ? "opacity-0 pointer-events-none" : getDayStatus(day)}
                        ${isToday ? "ring-2 ring-blue-400 ring-offset-1 z-10" : ""}
                      `}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
