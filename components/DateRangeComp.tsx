"use client";

import { renderingDates, nowDate } from "@/libs";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface bookDays {
  startDate: string;
  endDate: string;
}

const DateRangeComp = () => {
  const currDate = new Date();
  const [date, setDate] = useState(currDate);

  const searchParams = useSearchParams();

  const [bookDays, setBookDays] = useState<bookDays>({
    startDate: "",
    endDate: "",
  });

  // Helper functions
  const dates = renderingDates(date);
  const today = nowDate(date);

  // Navigate Months
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

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  //choose book days
  const bookDaysHandler = (selectedDate: string) => {
    const selected = new Date(selectedDate);
    //check if isnot selected start date
    if (!bookDays.startDate) {
      setBookDays({
        startDate: selectedDate,
        endDate: "",
      });
      return;
    }

    const startDate = new Date(bookDays.startDate);

    //check if  start date is equal selected date
    if (bookDays.startDate === selectedDate) {
      setBookDays({
        startDate: "",
        endDate: "",
      });
      return;
    }

    //check if start date is selected and if selectedDate is before start date
    if (startDate && selected < startDate) {
      setBookDays({
        startDate: selectedDate,
        endDate: "",
      });
      return;
    }

    //check if both date is selected
    if (bookDays.startDate && bookDays.endDate) {
      setBookDays({
        startDate: selectedDate,
        endDate: "",
      });
      return;
    }

    // Check if start date is selected and selected date is after start date
    if (bookDays.startDate && selected > startDate) {
      setBookDays((prev) => ({
        startDate: prev.startDate,
        endDate: selectedDate,
      }));
      return;
    }
  };

  return (
    <div className="max-w-[500px] bg-white px-6 pt-4 pb-2  border border-gray-100 mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800">
            {<p className="text-gray-500 font-medium">{today.year}</p>}
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

      {/* Day Names */}
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

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((_, i) => {
          const m = new Date(_.date).getDate();
          const isNotInMonth = _.isNotInMonth;
          const isToday = _.isToday;
          const isDisable = _.isDisable;
          const isSelected =
            _.date === bookDays.startDate ||
            _.date === bookDays.endDate ||
            (_.date > bookDays.startDate && _.date < bookDays.endDate);
          // Determine styling
          let baseClasses =
            "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 font-medium text-sm";

          if (isDisable) {
            baseClasses += " text-slate-200! cursor-not-allowed";
          } else if (isToday && !isSelected) {
            baseClasses +=
              "text-emerald-600 shadow-lgtransform scale-105 hover:bg-indigo-50 hover:shadow-md cursor-pointer";
          } else if (isToday && isSelected) {
            baseClasses +=
              "text-emerald-600  bg-green-200 hover:shadow-md cursor-pointer";
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
