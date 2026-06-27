"use client";
import React, { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Lock,
  Unlock,
  RefreshCw,
  CheckSquare,
  Square,
  X,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface DayInfo {
  id?: number;
  date: string;
  price?: number | null;
  isBooked?: boolean;
  isBlocked?: boolean;
}

interface MonthInfo {
  id?: number;
  month: number;
  year: number;
  price?: number | null;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function AdminCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [monthInfo, setMonthInfo] = useState<MonthInfo | null>(null);
  const [days, setDays] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Month price
  const [monthPrice, setMonthPrice] = useState("");

  // Multi-select
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // Bulk edit panel state
  const [bulkPrice, setBulkPrice] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setSelectedDates(new Set());
    try {
      const res = await fetch(`${API}/calendar?year=${year}&month=${month}`, {
        credentials: "include",
      });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const data = await res.json();
      if (data.success) {
        setMonthInfo(data.data.monthInfo);
        setDays(data.data.days || []);
        setMonthPrice(data.data.monthInfo?.price?.toString() || "");
      } else {
        setMonthInfo({ month, year });
        setDays([]);
        setMonthPrice("");
      }
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const navigate = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setMonth(m);
    setYear(y);
  };

  const saveMonthPrice = async () => {
    const price = parseInt(monthPrice);
    if (isNaN(price) || price < 0) return;
    setSaving(true);
    try {
      await fetch(`${API}/calendar/month`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ month, year, price }),
      });
      showToast("Month base price saved!");
      fetchCalendar();
    } finally {
      setSaving(false);
    }
  };

  const updateDays = async (dayUpdates: Partial<DayInfo>[]) => {
    setSaving(true);
    try {
      await fetch(`${API}/calendar/days`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dayUpdates),
      });
      showToast("Days updated!");
      fetchCalendar();
    } finally {
      setSaving(false);
    }
  };

  // Toggle a single day in selection
  const toggleDay = (date: string, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const clearSelection = () => setSelectedDates(new Set());

  const selectAll = () => {
    const selectable = calendarCells
      .filter((d): d is DayInfo => d !== null && !d.isBooked)
      .map((d) => d.date);
    setSelectedDates(new Set(selectable));
  };

  // Bulk set price
  const applyBulkPrice = async () => {
    const price = parseInt(bulkPrice);
    if (isNaN(price) || price < 0 || selectedDates.size === 0) return;
    const dayMap = new Map(days.map((d) => [d.date, d]));
    const updates = Array.from(selectedDates).map((date) => ({
      ...(dayMap.get(date) || {}),
      date,
      price,
    }));
    await updateDays(updates);
    setBulkPrice("");
    setSelectedDates(new Set());
  };

  // Bulk block/unblock
  const applyBulkBlock = async (block: boolean) => {
    if (selectedDates.size === 0) return;
    const dayMap = new Map(days.map((d) => [d.date, d]));
    const updates = Array.from(selectedDates).map((date) => ({
      ...(dayMap.get(date) || {}),
      date,
      isBlocked: block,
    }));
    await updateDays(updates);
    setSelectedDates(new Set());
  };

  // Clear prices on selected days
  const clearBulkPrice = async () => {
    if (selectedDates.size === 0) return;
    const dayMap = new Map(days.map((d) => [d.date, d]));
    const updates = Array.from(selectedDates).map((date) => ({
      ...(dayMap.get(date) || {}),
      date,
      price: 0,
    }));
    await updateDays(updates);
    setSelectedDates(new Set());
  };

  // Build calendar grid
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayMap = new Map(days.map((d) => [d.date, d]));
  const basePrice = monthInfo?.price ?? null;

  const calendarCells: (DayInfo | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push(dayMap.get(dateStr) || { date: dateStr });
  }

  const getDayBg = (day: DayInfo, isSelected: boolean) => {
    if (isSelected) return "bg-green-600 border-green-700 text-white";
    if (day.isBooked) return "bg-red-100 border-red-300 text-red-700 cursor-not-allowed";
    if (day.isBlocked) return "bg-orange-100 border-orange-300 text-orange-700";
    if (day.price != null && day.price > 0) return "bg-blue-50 border-blue-300 text-blue-800 hover:border-green-400 cursor-pointer";
    if (basePrice != null) return "bg-gray-50 border-gray-200 text-gray-600 hover:border-green-400 cursor-pointer";
    return "bg-white border-gray-200 text-gray-700 hover:border-green-400 cursor-pointer";
  };

  const getDisplayPrice = (day: DayInfo) => {
    if (day.price != null && day.price > 0) return `$${day.price}`;
    if (basePrice != null) return `$${basePrice}`;
    return null;
  };

  const selectedArray = Array.from(selectedDates);
  const allSelected = calendarCells
    .filter((d): d is DayInfo => d !== null && !d.isBooked)
    .every((d) => selectedDates.has(d.date));

  return (
    <AdminShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">
            Click days to select · Set prices · Block dates
          </p>
        </div>

        {/* Month navigation + base price */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">
                {MONTH_NAMES[month - 1]} {year}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {days.filter((d) => d.isBooked).length} booked ·{" "}
                {days.filter((d) => d.isBlocked).length} blocked ·{" "}
                {days.filter((d) => d.price != null && d.price > 0).length} custom price
              </p>
            </div>
            <button onClick={() => navigate(1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Base monthly price */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
            <span className="text-sm font-bold text-gray-400 shrink-0 w-4 h-4 flex items-center justify-center">₾</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Base price for {MONTH_NAMES[month - 1]} (applied to all unpriced days)
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={monthPrice}
                  onChange={(e) => setMonthPrice(e.target.value)}
                  placeholder="e.g. 150"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={saveMonthPrice}
                  disabled={saving || !monthPrice}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            {[
              { color: "bg-green-600 border-green-700", label: "Selected" },
              { color: "bg-red-100 border-red-300", label: "Booked" },
              { color: "bg-orange-100 border-orange-300", label: "Blocked" },
              { color: "bg-blue-50 border-blue-300", label: "Custom price" },
              { color: "bg-gray-50 border-gray-200", label: "Base price" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded border ${color}`} />
                <span className="text-gray-500">{label}</span>
              </div>
            ))}
          </div>

          {/* Select all toggle */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={allSelected ? clearSelection : selectAll}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-700 transition-colors"
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-green-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              {allSelected ? "Deselect all" : "Select all available days"}
            </button>
            {selectedDates.size > 0 && (
              <span className="text-xs font-semibold text-green-700">
                {selectedDates.size} day{selectedDates.size !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div className="grid grid-cols-7 gap-1.5">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1.5">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((day, idx) =>
                  day === null ? (
                    <div key={idx} />
                  ) : (
                    <button
                      key={day.date}
                      onClick={() => toggleDay(day.date, !!day.isBooked)}
                      disabled={!!day.isBooked}
                      className={`relative aspect-square rounded-lg border text-xs flex flex-col items-center justify-center gap-0 transition-all select-none ${getDayBg(day, selectedDates.has(day.date))}`}
                    >
                      <span className="font-bold text-sm leading-none">
                        {new Date(day.date + "T12:00").getDate()}
                      </span>
                      {day.isBooked ? (
                        <span className="text-[9px] opacity-80 leading-none mt-0.5">booked</span>
                      ) : day.isBlocked ? (
                        <span className="text-[9px] opacity-80 leading-none mt-0.5">blocked</span>
                      ) : (
                        <span className={`text-[10px] leading-none mt-0.5 ${selectedDates.has(day.date) ? "text-green-100" : day.price != null && day.price > 0 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>
                          {getDisplayPrice(day)}
                        </span>
                      )}
                      {/* Custom price indicator dot */}
                      {day.price != null && day.price > 0 && !day.isBooked && !day.isBlocked && !selectedDates.has(day.date) && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* Bulk action panel — appears when days are selected */}
        {selectedDates.size > 0 && (
          <div className="bg-white rounded-xl border-2 border-green-400 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                Edit{" "}
                <span className="text-green-700">
                  {selectedDates.size} selected day{selectedDates.size !== 1 ? "s" : ""}
                </span>
              </h3>
              <button
                onClick={clearSelection}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Set price */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Set price for all selected days
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min={0}
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      placeholder="Enter price"
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={applyBulkPrice}
                    disabled={saving || !bulkPrice}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    <Save className="w-4 h-4" /> Apply
                  </button>
                </div>
                <button
                  onClick={clearBulkPrice}
                  disabled={saving}
                  className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear custom prices (use base price)
                </button>
              </div>

              {/* Block/Unblock */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Availability
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => applyBulkBlock(true)}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium hover:bg-orange-200 disabled:opacity-50 transition-colors"
                  >
                    <Lock className="w-4 h-4" /> Block days
                  </button>
                  <button
                    onClick={() => applyBulkBlock(false)}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    <Unlock className="w-4 h-4" /> Unblock days
                  </button>
                </div>
              </div>
            </div>

            {/* Selected date chips */}
            <div className="mt-4 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedArray.sort().map((date) => (
                <span
                  key={date}
                  className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-800 text-xs px-2 py-1 rounded-lg"
                >
                  {date}
                  <button
                    onClick={() => toggleDay(date, false)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={fetchCalendar}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reload calendar
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </AdminShell>
  );
}
