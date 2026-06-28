"use client";

import { renderingDates, nowDate } from "@/libs";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookDays {
  startDate: string;
  endDate: string;
}

interface Props {
  value?: BookDays;
  onChange?: (days: BookDays) => void;
  disabledDates?: string[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DateRangeComp = ({ value, onChange, disabledDates = [] }: Props) => {
  const [date, setDate] = useState(() => new Date());
  const [internalDays, setInternalDays] = useState<BookDays>({ startDate: "", endDate: "" });

  const bookDays = value ?? internalDays;
  const setBookDays = (days: BookDays) => {
    if (onChange) onChange(days);
    else setInternalDays(days);
  };

  const dates = renderingDates(date);
  const today = nowDate(date);

  const nextMonth = () => {
    setDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() + 1);
      return n;
    });
  };

  const prevMonth = () => {
    setDate((d) => {
      const p = new Date(d);
      p.setMonth(p.getMonth() - 1);
      return p;
    });
  };

  const hasUnavailableBetween = (start: string, end: string) =>
    disabledDates.some((d) => d > start && d < end);

  const bookDaysHandler = (selectedDate: string) => {
    if (!bookDays.startDate || bookDays.endDate) {
      setBookDays({ startDate: selectedDate, endDate: "" });
      return;
    }
    if (bookDays.startDate === selectedDate) {
      setBookDays({ startDate: "", endDate: "" });
      return;
    }
    if (new Date(selectedDate) < new Date(bookDays.startDate)) {
      setBookDays({ startDate: selectedDate, endDate: "" });
      return;
    }
    if (hasUnavailableBetween(bookDays.startDate, selectedDate)) {
      setBookDays({ startDate: selectedDate, endDate: "" });
      return;
    }
    setBookDays({ startDate: bookDays.startDate, endDate: selectedDate });
  };

  return (
    <div className="bg-white px-4 sm:px-6 pt-4 pb-2 border border-gray-100 mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-500 font-medium text-sm">{today.year}</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 min-w-20 text-center">
            {today.monthShort}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="w-10" />
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-3">
        {DAY_NAMES.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid — w-9/h-9 on mobile, w-12/h-12 on sm+ */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {dates.map((cell, i) => {
          const dayNum = new Date(cell.date).getDate();
          const isUnavailable = disabledDates.includes(cell.date);
          const isDisabled = cell.isDisable || isUnavailable;
          const isSelected =
            cell.date === bookDays.startDate ||
            cell.date === bookDays.endDate ||
            (!!bookDays.startDate &&
              !!bookDays.endDate &&
              cell.date > bookDays.startDate &&
              cell.date < bookDays.endDate);

          let cls =
            "flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl transition-all duration-200 font-medium text-xs sm:text-sm";

          if (cell.isNotInMonth) {
            cls += " invisible";
          } else if (isUnavailable) {
            cls += " bg-red-50 text-red-300 cursor-not-allowed";
          } else if (isDisabled) {
            cls += " text-slate-200 cursor-not-allowed";
          } else if (isSelected) {
            cls += " text-gray-700 bg-green-200 hover:shadow-md cursor-pointer";
          } else if (cell.isToday) {
            cls += " text-emerald-600 hover:bg-indigo-50 hover:shadow-md cursor-pointer font-bold";
          } else {
            cls += " text-gray-700 hover:bg-indigo-50 hover:shadow-md cursor-pointer";
          }

          return (
            <div
              key={i}
              className={cls}
              onClick={() => !isDisabled && !cell.isNotInMonth && bookDaysHandler(cell.date)}
              title={isUnavailable ? "Not available" : undefined}
            >
              {!cell.isNotInMonth && <span>{dayNum}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateRangeComp;
