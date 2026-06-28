"use client";
import React, { useEffect, useState, useCallback } from "react";
import DateRangeComp from "@/components/DateRangeComp";
import { Home } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface Cottage {
  id: number;
  name: string;
  maxGuests: number;
}

export default function CalendarPage() {
  const { t } = useContent();
  const [multiCottageMode, setMultiCottageMode] = useState(false);
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [selectedCottageId, setSelectedCottageId] = useState<number | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load settings + cottages
  useEffect(() => {
    (async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          fetch(`${API}/settings`),
          fetch(`${API}/cottage`),
        ]);
        const settings = await sRes.json();
        const cottageList: Cottage[] = await cRes.json();
        const isMulti = settings?.multi_cottage_mode === "true";
        setMultiCottageMode(isMulti);
        if (Array.isArray(cottageList)) {
          setCottages(cottageList);
          if (!isMulti && cottageList.length > 0) {
            setSelectedCottageId(null); // single mode uses global (cottageId=0)
          }
        }
      } catch {}
    })();
  }, []);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const unavailable: string[] = [];
      const cottageParam = (multiCottageMode && selectedCottageId) ? `&cottageId=${selectedCottageId}` : "";
      for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        try {
          const res = await fetch(
            `${API}/calendar?year=${d.getFullYear()}&month=${d.getMonth() + 1}${cottageParam}`
          );
          const data = await res.json();
          if (data.success && data.data?.days) {
            data.data.days.forEach((day: { date: string; isBooked?: boolean; isBlocked?: boolean }) => {
              if (day.isBooked || day.isBlocked) unavailable.push(day.date);
            });
          }
        } catch {}
      }
      setUnavailableDates(unavailable);
    } finally {
      setLoading(false);
    }
  }, [multiCottageMode, selectedCottageId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return (
    <section className="w-full min-h-screen mt-[100px] pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("calendar_page_title", "Availability Calendar")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t("calendar_page_subtitle", "Check available dates before booking")}</p>
        </div>

        {/* Cottage selector — only in multi-cottage mode */}
        {multiCottageMode && cottages.length > 0 && (
          <div className="mb-5 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" /> {t("select_cottage_label", "Select a cottage")}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCottageId(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  selectedCottageId === null
                    ? "bg-green-600 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {t("all_cottages_label", "All cottages")}
              </button>
              {cottages.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCottageId(c.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    selectedCottageId === c.id
                      ? "bg-green-600 text-white border-green-700"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />
            {t("booked_label", "Not available")}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
            {t("selected_label", "Selected")}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-white border border-gray-200" />
            {t("available_label", "Available")}
          </div>
        </div>

        {loading ? (
          <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <DateRangeComp disabledDates={unavailableDates} />
          </div>
        )}
      </div>
    </section>
  );
}
