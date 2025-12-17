"use client";
import React, { useState, useEffect } from "react";

interface CalendarProps {
  onDateSelect?: (dates: Date[]) => void;
  bookedDates?: Date[];
  allowMultipleSelection?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  bookedDates = [],
  allowMultipleSelection = true,
  minDate,
  maxDate,
}) => {
  const daysArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const CurrentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(CurrentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(CurrentDate.getFullYear());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // დღეების რაოდენობა მიმდინარე თვეში
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // თვის პირველი დღის დღიური ინდექსი (0 = კვირა, 1 = ორშაბათი, ...)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // წინა თვის დღეების რაოდენობა
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // თვეების გადართვის ფუნქციები
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(CurrentDate.getMonth());
    setCurrentYear(CurrentDate.getFullYear());
  };

  // დღის არჩევა/მონიშვნა
  const handleDateClick = (day: number, monthOffset: number = 0) => {
    const clickedDate = new Date(currentYear, currentMonth + monthOffset, day);

    // თუ დღე დაჯავშნილია, არ გავაკეთოთ არაფერი
    if (isDateBooked(clickedDate)) return;

    // თუ დღე არ არის ნებადართულ დიაპაზონში
    if (minDate && clickedDate < minDate) return;
    if (maxDate && clickedDate > maxDate) return;

    let newSelectedDates: Date[] = [];

    if (allowMultipleSelection) {
      // მრავალი დღის არჩევის ლოგიკა
      if (selectedDates.some((date) => isSameDay(date, clickedDate))) {
        // თუ დღე უკვე არჩეულია, ამოიღეთ იგი
        newSelectedDates = selectedDates.filter(
          (date) => !isSameDay(date, clickedDate)
        );
      } else {
        // დაამატეთ ახალი დღე
        newSelectedDates = [...selectedDates, clickedDate];
      }
    } else {
      // ერთი დღის არჩევის ლოგიკა
      newSelectedDates = [clickedDate];
    }

    setSelectedDates(newSelectedDates);

    // გამოაცხადეთ არჩეული დღეები მშობელ კომპონენტს
    if (onDateSelect) {
      onDateSelect(newSelectedDates);
    }
  };

  // დღეების შედარება (იგივე თარიღია თუ არა)
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // შეამოწმეთ არის თუ არა დღე დაჯავშნილი
  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some((bookedDate) => isSameDay(bookedDate, date));
  };

  // შეამოწმეთ არის თუ არა დღე არჩეული
  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some((selectedDate) => isSameDay(selectedDate, date));
  };

  // შეამოწმეთ არის თუ არა დღე დღევანდელი
  const isToday = (day: number, monthOffset: number = 0): boolean => {
    const date = new Date(currentYear, currentMonth + monthOffset, day);
    return isSameDay(date, CurrentDate);
  };

  // შეამოწმეთ არის თუ არა დღე დიაპაზონში
  const isDateInRange = (date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  // გენერირება წინა თვის ბოლო დღეებისთვის
  const generatePrevMonthDays = () => {
    const days = [];
    const startDay = daysInPrevMonth - firstDayOfMonth + 1;

    for (let i = startDay; i <= daysInPrevMonth; i++) {
      days.push(
        <div
          key={`prev-${i}`}
          className="p-2 text-center text-gray-400 cursor-default"
        >
          {i}
        </div>
      );
    }

    return days;
  };

  // გენერირება მომდევნო თვის პირველი დღეებისთვის
  const generateNextMonthDays = () => {
    const days = [];
    const totalCells = 42; // 6 რიგი * 7 სვეტი
    const totalDaysDisplayed = firstDayOfMonth + daysInMonth;
    const daysToShow = totalCells - totalDaysDisplayed;

    for (let i = 1; i <= daysToShow; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="p-2 text-center text-gray-400 cursor-default"
        >
          {i}
        </div>
      );
    }

    return days;
  };

  // გენერირება მიმდინარე თვის დღეებისთვის
  const generateCurrentMonthDays = () => {
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isBooked = isDateBooked(date);
      const isSelected = isDateSelected(date);
      const isTodayDate = isToday(i);
      const isInRange = isDateInRange(date);

      let dayClasses =
        "p-2 text-center rounded-lg transition-all duration-200 cursor-pointer ";

      if (isBooked) {
        dayClasses +=
          "bg-red-100 text-red-800 line-through cursor-not-allowed ";
      } else if (isSelected) {
        dayClasses += "bg-blue-500 text-white shadow-md ";
      } else if (isTodayDate) {
        dayClasses += "bg-blue-100 text-blue-700 font-medium ";
      } else if (!isInRange) {
        dayClasses += "text-gray-300 cursor-not-allowed ";
      } else {
        dayClasses += "hover:bg-gray-100 ";
      }

      days.push(
        <div
          key={`current-${i}`}
          className={dayClasses}
          onClick={() => (isBooked || !isInRange ? null : handleDateClick(i))}
          onMouseEnter={() =>
            !isBooked && isInRange ? setHoveredDate(date) : null
          }
          onMouseLeave={() => setHoveredDate(null)}
        >
          {i}
          {isBooked && (
            <div className="text-xs mt-1 font-medium">დაჯავშნილი</div>
          )}
        </div>
      );
    }

    return days;
  };

  // სტილების CSS
  const calendarStyles = `
    .calendar-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .calendar-day:hover:not(.booked):not(.disabled) {
      transform: translateY(-2px);
    }
    
    .calendar-header {
      transition: background-color 0.2s;
    }
    
    .selected-date-range {
      background: linear-gradient(90deg, #e0f2fe 0%, #dbeafe 100%);
    }
  `;

  return (
    <div className="calendar-container max-w-md mx-auto p-4 bg-white rounded-xl shadow-lg">
      <style>{calendarStyles}</style>

      {/* კალენდრის ჰედერი - თვე და წელი */}
      <div className="flex justify-between items-center mb-6 calendar-header p-3 rounded-lg bg-gray-50">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {monthArray[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={goToToday}
            className="text-sm text-blue-600 hover:text-blue-800 mt-1 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
          >
            დღეს
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* კვირის დღეების სათაურები */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysArray.map((day, i) => (
          <div
            key={i}
            className="p-2 text-center text-sm font-medium text-gray-600"
          >
            {day.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* კალენდრის დღეები */}
      <div className="grid grid-cols-7 gap-1">
        {/* წინა თვის დღეები */}
        {generatePrevMonthDays()}

        {/* მიმდინარე თვის დღეები */}
        {generateCurrentMonthDays()}

        {/* მომდევნო თვის დღეები */}
        {generateNextMonthDays()}
      </div>

      {/* ლეგენდა და სტატუსი */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-700">
            {selectedDates.length > 0 ? (
              <span>არჩეულია {selectedDates.length} დღე</span>
            ) : (
              <span>აირჩიეთ დღე(ები)</span>
            )}
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs text-gray-600">არჩეული</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-100 mr-1"></div>
              <span className="text-xs text-gray-600">დაჯავშნილი</span>
            </div>
          </div>
        </div>

        {/* არჩეული დღეების ჩვენება */}
        {selectedDates.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">
              არჩეული დღეები:
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {date.getDate()} {monthArray[date.getMonth()].slice(0, 3)}{" "}
                    {date.getFullYear()}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* მინიმალური/მაქსიმალური თარიღების მითითება */}
      {(minDate || maxDate) && (
        <div className="mt-3 text-xs text-gray-500">
          {minDate && (
            <p>
              დაშვებულია დღეები {minDate.getDate()}/{minDate.getMonth() + 1}/
              {minDate.getFullYear()}-იდან
            </p>
          )}
          {maxDate && (
            <p>
              დაშვებულია დღეები {maxDate.getDate()}/{maxDate.getMonth() + 1}/
              {maxDate.getFullYear()}-მდე
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
