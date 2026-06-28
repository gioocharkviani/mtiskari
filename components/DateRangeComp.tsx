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
    <div className="w-full bg-white px-3 sm:px-5 pt-4 pb-3 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{today.year}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-base font-semibold text-gray-800 min-w-[90px] text-center">
            {today.monthShort}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="w-12" /> {/* spacer to balance the year text */}
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((day) => (
          <div key={day} className="text-center text-[10px] sm:text-xs font-semibold text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid — aspect-square cells fill the container width */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {dates.map((cell, i) => {
          const dayNum = new Date(cell.date).getDate();
          const isUnavailable = disabledDates.includes(cell.date);
          const isDisabled = cell.isDisable || isUnavailable;
          const isSelected =
            cell.date === bookDays.startDate ||
            cell.date === bookDays.endDate ||
            (bookDays.startDate &&
              bookDays.endDate &&
              cell.date > bookDays.startDate &&
              cell.date < bookDays.endDate);

          let cls =
            "aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all duration-150";

          if (cell.isNotInMonth) {
            cls += " invisible";
          } else if (isUnavailable) {
            cls += " bg-red-50 text-red-300 cursor-not-allowed";
          } else if (isDisabled) {
            cls += " text-gray-200 cursor-not-allowed";
          } else if (isSelected) {
            cls += " bg-green-200 text-gray-800 cursor-pointer";
          } else if (cell.isToday) {
            cls += " text-emerald-600 font-bold hover:bg-gray-100 cursor-pointer";
          } else {
            cls += " text-gray-700 hover:bg-gray-100 cursor-pointer";
          }

          return (
            <div
              key={i}
              className={cls}
              onClick={() => !isDisabled && !cell.isNotInMonth && bookDaysHandler(cell.date)}
              title={isUnavailable ? "Not available" : undefined}
            >
              {!cell.isNotInMonth && dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateRangeComp;
