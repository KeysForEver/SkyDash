import React from "react";
import { Servico } from "../types";
import { cn } from "../lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  data: Servico[];
  months?: Date[];
  statusColorMap?: Record<string, string>;
}

export const GithubCalendar: React.FC<Props> = ({ data, months: customMonths, statusColorMap = {} }) => {
  const today = new Date();
  const months = customMonths || [
    today,
    addMonths(today, 1)
  ];

  const parseExcelDate = (val: any): Date | null => {
    if (!val) return null;
    let date: Date | null = null;

    if (val instanceof Date) {
      date = val;
    } else if (typeof val === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      date = new Date(excelEpoch.getTime() + val * 86400000);
    } else if (typeof val === "string" && val.trim() !== "") {
      const trimmed = val.trim();
      if (trimmed.includes("/")) {
        const parts = trimmed.split("/");
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          const fullYear = year < 100 ? (year + 2000) : year;
          date = new Date(fullYear, month - 1, day);
        }
      } else if (trimmed.includes("-")) {
        const parts = trimmed.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            date = new Date(year, month - 1, day);
          } else {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            const fullYear = year < 100 ? (year + 2000) : year;
            date = new Date(fullYear, month - 1, day);
          }
        }
      }
    }

    if (!date || isNaN(date.getTime())) {
      date = new Date(val);
    }

    if (!date || isNaN(date.getTime())) {
      return null;
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const getServicesOnDay = (date: Date) => {
    const targetMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return data.filter(item => {
      const dateInicialVal = item["DATA INICIAL"];
      const dateFinalVal = item["DATA FINAL"];

      if (dateInicialVal || dateFinalVal) {
        const start = parseExcelDate(dateInicialVal);
        const end = parseExcelDate(dateFinalVal);

        if (start && end) {
          return targetMidnight >= start && targetMidnight <= end;
        } else if (start) {
          return targetMidnight.getTime() === start.getTime();
        } else if (end) {
          return targetMidnight.getTime() === end.getTime();
        }
        return false;
      }

      // Fallback a colunas legadas se existirem
      const legacyVal = item["DATA INSTALAÇÃO"] || item["DATA"];
      if (!legacyVal) return false;

      const legacyDate = parseExcelDate(legacyVal);
      if (!legacyDate) return false;

      return targetMidnight.getTime() === legacyDate.getTime();
    });
  };

  const getContrastColor = (hexColor: string | null): string => {
    if (!hexColor) return "text-gray-400";
    
    // Clean hex
    const color = hexColor.replace("#", "");
    if (color.length !== 6) return "text-white";
    
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Calculate YIQ contrast ratio
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? "text-gray-900" : "text-white";
  };

  const getDayStatusColor = (services: Servico[]) => {
    if (services.length === 0) return null;

    const statuses = services.map(s => (s["STATUS INSTALAÇÃO"] || "").trim().toUpperCase());
    
    // Prioritize statuses
    const alertStatus = statuses.find(s => s === "ATRASADO");
    if (alertStatus && statusColorMap[alertStatus]) {
      return statusColorMap[alertStatus];
    }

    const warningStatus = statuses.find(s => s === "PENDENTE" || s === "EM ANDAMENTO" || s.includes("AGUARDANDO"));
    if (warningStatus && statusColorMap[warningStatus]) {
      return statusColorMap[warningStatus];
    }

    const activeStatus = statuses.find(s => s !== "CONCLUÍDO" && statusColorMap[s]);
    if (activeStatus) {
      return statusColorMap[activeStatus];
    }

    const completedStatus = statuses.find(s => s === "CONCLUÍDO");
    if (completedStatus && statusColorMap[completedStatus]) {
      return statusColorMap[completedStatus];
    }

    const firstStatus = statuses.find(s => statusColorMap[s]);
    if (firstStatus) {
      return statusColorMap[firstStatus];
    }

    return "#70757a"; 
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
            const statusColor = isCurrentMonth ? getDayStatusColor(services) : null;
            const contrastClass = getContrastColor(statusColor);
            
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg transition-all duration-300 flex flex-col p-1 min-h-0 overflow-hidden border",
                  !isCurrentMonth ? "opacity-0 pointer-events-none" : (!statusColor ? "bg-gray-50 border-gray-100" : ""),
                  contrastClass,
                  isToday && "border-red-600 border-2 z-20 shadow-md ring-1 ring-red-600/20"
                )}
                style={isCurrentMonth && statusColor ? { backgroundColor: statusColor, borderColor: statusColor } : undefined}
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
      <div className={cn("flex-1 grid gap-4 min-h-0 h-full", months.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
        {months.map(renderMonth)}
      </div>
    </div>
  );
};
