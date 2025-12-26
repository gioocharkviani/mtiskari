"use client";

import { renderingDates, nowDate } from "@/libs";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DateRangeComp = () => {
  const currDate = new Date();
  const [date, setDate] = useState(currDate);

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

  return (
    <div className="max-w-[500px] bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mx-auto">
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
            <h2 className="text-2xl font-bold text-gray-800">{today.month}</h2>
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
          const isDisabled = _.isDisable;
          const isToday = _.isToday;

          // Determine styling
          let baseClasses =
            "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 font-medium text-sm";

          if (isDisabled) {
            baseClasses += " text-gray-400 ";
          } else if (isToday) {
            baseClasses +=
              " bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-indigo-200 transform scale-105";
          } else {
            baseClasses +=
              " text-gray-700 hover:bg-indigo-50 hover:shadow-md cursor-pointer";
          }

          return (
            <div
              className={baseClasses}
              key={i}
              onClick={() =>
                !isDisabled && console.log("Date selected:", _.date)
              }
            >
              {!isDisabled && (
                <span className={isToday ? "font-bold" : ""}>{m}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Date Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-linear-to-r from-green-500 to-emerald-600"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="text-gray-500">
            {currDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeComp;
