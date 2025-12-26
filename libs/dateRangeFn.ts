interface daysType {
  isToday: boolean;
  date: string;
  isDisable: boolean;
}

//Date Format YYYY-MM-DD
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const format = `${y}-${m}-${d}`;
  return format;
};

const renderingDates = (date?: Date) => {
  const DATE = date ? date : new Date();
  const TODAY = new Date();
  const MONTH = DATE.getMonth();
  const YEAR = DATE.getFullYear();
  const firstDayOfMonth = new Date(YEAR, MONTH, 1);
  const startDayIndex = firstDayOfMonth.getDay();
  //to render  7X6 date in calendar
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDayIndex);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 42);
  const days: daysType[] = [];

  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const isToday =
      currentDate.getDate() === TODAY.getDate() &&
      currentDate.getMonth() === TODAY.getMonth() &&
      currentDate.getFullYear() === TODAY.getFullYear();

    const isDisable = currentDate.getMonth() !== MONTH;

    days.push({
      date: formatDate(currentDate),
      isToday,
      isDisable,
    });
  }

  return days;
};

const nowDate = (date: Date) => {
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const day = date.getFullYear();
  return { month, year, day };
};

export { renderingDates, nowDate };
