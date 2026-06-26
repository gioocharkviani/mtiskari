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

const DateRangeComp = ({ value, onChange, disabledDates = [] }: Props) => {
  const currDate = new Date();
  const [date, setDate] = useState(currDate);

  // Support both controlled (value+onChange) and uncontrolled mode
  const [internalDays, setInternalDays] = useState<BookDays>({
    startDate: "",
    endDate: "",
  });

  const bookDays = value ?? internalDays;
  const setBookDays = (days: BookDays) => {
    if (onChange) onChange(days);
    else setInternalDays(days);
  };

  const dates = renderingDates(date);
  const today = nowDate(date);

  const nextMonth = () => {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 1);
    setDate(nextDate);
  };

  const prevMonth = () => {
    const prevDate = new Date(date);
    prevDate.setMonth(prevDate.getMonth() - 1);
    setDate(prevDate);
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const bookDaysHandler = (selectedDate: string) => {
    if (!bookDays.startDate) {
      setBookDays({ startDate: selectedDate, endDate: "" });
      return;
    }

    const startDate = new Date(bookDays.startDate);
    const selected = new Date(selectedDate);

    if (bookDays.startDate === selectedDate) {
      setBookDays({ startDate: "", endDate: "" });
      return;
    }

    if (selected < startDate) {
      setBookDays({ startDate: selectedDate, endDate: "" });
      return;
    }

    if (bookDays.startDate && bookDays.endDate) {
      setBookDays({ startDate: selectedDate, endDate: "" });
      return;
    }

    if (bookDays.startDate && selected > startDate) {
      setBookDays({ startDate: bookDays.startDate, endDate: selectedDate });
      return;
    }
  };

  return (
    <div className="max-w-[500px] bg-white px-6 pt-4 pb-2 border border-gray-100 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800">
            <p className="text-gray-500 font-medium">{today.year}</p>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {today.monthShort}
            </h2>
          </div>

          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-3">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((_, i) => {
          const m = new Date(_.date).getDate();
          const isNotInMonth = _.isNotInMonth;
          const isToday = _.isToday;
          const isUnavailable = disabledDates.includes(_.date);
          const isDisable = _.isDisable || isUnavailable;
          const isSelected =
            _.date === bookDays.startDate ||
            _.date === bookDays.endDate ||
            (bookDays.startDate &&
              bookDays.endDate &&
              _.date > bookDays.startDate &&
              _.date < bookDays.endDate);

          let baseClasses =
            "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 font-medium text-sm";

          if (isDisable) {
            baseClasses += isUnavailable
              ? " bg-red-50 text-red-300 cursor-not-allowed"
              : " text-slate-200 cursor-not-allowed";
          } else if (isToday && !isSelected) {
            baseClasses +=
              " text-emerald-600 hover:bg-indigo-50 hover:shadow-md cursor-pointer";
          } else if (isSelected) {
            baseClasses +=
              " text-gray-700 bg-green-200 hover:shadow-md cursor-pointer";
          } else {
            baseClasses +=
              " text-gray-700 hover:bg-indigo-50 hover:shadow-md cursor-pointer";
          }

          return (
            <div
              className={baseClasses}
              key={i}
              onClick={() => !isDisable && bookDaysHandler(_.date)}
              title={isUnavailable ? "Not available" : undefined}
            >
              {!isNotInMonth && <span>{m}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateRangeComp;
