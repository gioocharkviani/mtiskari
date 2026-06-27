"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  Users,
  X,
  ChevronUp,
  ChevronDown,
  Home,
  CheckCircle,
} from "lucide-react";
import DateRangeComp from "../DateRangeComp";
import { Button } from "../ui";
import { useContent } from "@/context/ContentContext";

const API =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface BookDays {
  startDate: string;
  endDate: string;
}

interface BookingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Cottage {
  id: number;
  name: string;
  description?: string;
  maxGuests: number;
}

const bookingVariants: Variants = {
  hidden: { opacity: 0, y: 100, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 50,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.3 },
  },
};

function diffDays(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24),
  );
}

export default function HeroBooking() {
  const { t } = useContent();
  const [openDateRange, setOpenDateRange] = useState(false);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [multiCottageMode, setMultiCottageMode] = useState(false);
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [selectedCottage, setSelectedCottage] = useState<Cottage | null>(null);
  const [showCottagePicker, setShowCottagePicker] = useState(false);
  const [bookDays, setBookDays] = useState<BookDays>({
    startDate: "",
    endDate: "",
  });
  const [guestCount, setGuestCount] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [form, setForm] = useState<BookingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const nights =
    bookDays.startDate && bookDays.endDate
      ? diffDays(bookDays.startDate, bookDays.endDate)
      : 0;

  const fetchAvailability = useCallback(async () => {
    const now = new Date();
    const unavailable: string[] = [];
    // Only pass cottageId in multi-cottage mode; single-cottage always uses cottageId=0 (global)
    const cottageParam = (multiCottageMode && selectedCottage) ? `&cottageId=${selectedCottage.id}` : "";
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      try {
        const res = await fetch(
          `${API}/calendar?year=${d.getFullYear()}&month=${d.getMonth() + 1}${cottageParam}`,
        );
        const data = await res.json();
        if (data.success && data.data?.days) {
          data.data.days.forEach(
            (day: {
              date: string;
              isBooked?: boolean;
              isBlocked?: boolean;
            }) => {
              if (day.isBooked || day.isBlocked) unavailable.push(day.date);
            },
          );
        }
      } catch {
        // ignore
      }
    }
    setUnavailableDates(unavailable);
  }, [selectedCottage, multiCottageMode]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  useEffect(() => {
    (async () => {
      try {
        const [settingsRes, cottagesRes] = await Promise.all([
          fetch(`${API}/settings`),
          fetch(`${API}/cottage`),
        ]);
        const settings = await settingsRes.json();
        const cottageList: Cottage[] = await cottagesRes.json();
        const isMulti = settings?.multi_cottage_mode === "true";
        setMultiCottageMode(isMulti);
        if (Array.isArray(cottageList)) {
          setCottages(cottageList);
          if (!isMulti && cottageList.length > 0) {
            setSelectedCottage(cottageList[0]);
          }
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (!bookDays.startDate || !bookDays.endDate || nights <= 0) {
      setTotalPrice(0);
      return;
    }

    const calcPrice = async () => {
      const start = new Date(bookDays.startDate);
      const monthYear = {
        year: start.getFullYear(),
        month: start.getMonth() + 1,
      };
      try {
        // Only pass cottageId in multi-cottage mode; single-cottage always uses cottageId=0 (global)
        const cottageParam = (multiCottageMode && selectedCottage) ? `&cottageId=${selectedCottage.id}` : "";
        const res = await fetch(
          `${API}/calendar?year=${monthYear.year}&month=${monthYear.month}${cottageParam}`,
        );
        const data = await res.json();
        if (data.success) {
          const monthBasePrice = data.data?.monthInfo?.price ?? 0;
          const dayMap = new Map(
            (data.data?.days || []).map(
              (d: { date: string; price?: number }) => [d.date, d.price],
            ),
          );
          let price = 0;
          const cur = new Date(bookDays.startDate);
          const end = new Date(bookDays.endDate);
          end.setDate(end.getDate() - 1);
          while (cur <= end) {
            const key = cur.toISOString().split("T")[0];
            const dayPrice = dayMap.get(key);
            price += typeof dayPrice === "number" && dayPrice > 0 ? dayPrice : monthBasePrice;
            cur.setDate(cur.getDate() + 1);
          }
          setTotalPrice(price);
        } else {
          setTotalPrice(0);
        }
      } catch {
        setTotalPrice(0);
      }
    };
    calcPrice();
  }, [bookDays, nights, selectedCottage, multiCottageMode]);

  const applyDates = () => {
    if (bookDays.startDate && bookDays.endDate) {
      setOpenDateRange(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/booking/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          checkInDate: bookDays.startDate,
          checkOutDate: bookDays.endDate,
          guestCount,
          totalPrice,
          ...(multiCottageMode && selectedCottage ? { cottageId: selectedCottage.id } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Booking failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setOpenBookingModal(false);
    setSuccess(false);
    setError("");
    setBookDays({ startDate: "", endDate: "" });
    setGuestCount(2);
    setTotalPrice(0);
    setForm({ firstName: "", lastName: "", email: "", phone: "" });
    if (multiCottageMode) setSelectedCottage(null);
  };

  const showMultiPicker = multiCottageMode && cottages.length > 1;

  return (
    <>
      {/* Cottage picker modal */}
      {showCottagePicker && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowCottagePicker(false)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-green-800 px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">Choose a Cottage</h3>
                <p className="text-green-200 text-xs mt-0.5">
                  Select which cottage you&apos;d like to book
                </p>
              </div>
              <button
                onClick={() => setShowCottagePicker(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {cottages.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCottage(c);
                    setShowCottagePicker(false);
                    setOpenDateRange(true);
                  }}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedCottage?.id === c.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      {selectedCottage?.id === c.id && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {c.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                        {c.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Up to {c.maxGuests} guests
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Date range modal */}
      {openDateRange && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpenDateRange(false)}
        >
          <motion.div
            className="relative w-max h-max max-w-[95vw] max-h-[95vh] bg-white overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl flex flex-col"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-auto">
              <div className="w-full">
                <DateRangeComp
                  value={bookDays}
                  onChange={setBookDays}
                  disabledDates={unavailableDates}
                />
                <div className="border-t px-6 gap-2 py-2 border-gray-100 flex justify-end">
                  <Button
                    variant="customGreen"
                    onClick={applyDates}
                    {...{ disabled: !bookDays.startDate || !bookDays.endDate }}
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={() => setOpenDateRange(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Booking info modal */}
      {openBookingModal && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => !loading && !success && resetBooking()}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Booking Received!
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  We&apos;ve received your booking request. The admin will
                  confirm it and you&apos;ll get an email with details.
                </p>
                <Button variant="customGreen" onClick={resetBooking}>
                  Done
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-green-800 px-6 py-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">
                      Complete Your Booking
                      {selectedCottage && (
                        <span className="text-green-200 font-normal">
                          {" "}
                          — {selectedCottage.name}
                        </span>
                      )}
                    </h3>
                    <p className="text-green-200 text-xs mt-0.5">
                      {bookDays.startDate} → {bookDays.endDate} · {nights} night{nights !== 1 ? "s" : ""}
                      {totalPrice > 0 ? ` · ₾${totalPrice}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={resetBooking}
                    className="text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleBook} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        First Name *
                      </label>
                      <input
                        required
                        value={form.firstName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, firstName: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Last Name *
                      </label>
                      <input
                        required
                        value={form.lastName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastName: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+995 555 123 456"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-4 text-sm">
                    <div className="flex justify-between items-center text-gray-600 mb-1">
                      <span>{nights} night{nights !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-gray-900">
                      <span>{t("total_cost_label", "Total Cost")}</span>
                      <span>{totalPrice > 0 ? `₾${totalPrice}` : t("price_on_request", "Price on request")}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Confirm Booking"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Main booking widget */}
      <motion.div
        className="w-full max-w-[1500px] border-[3px] bg-white backdrop-blur-md rounded-2xl p-6 shadow-lg"
        initial="hidden"
        animate="visible"
        variants={bookingVariants}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="w-full justify-between flex md:flex-row flex-col gap-4">
            {/* COTTAGE PICKER — shown only in multi-cottage mode */}
            {showMultiPicker && (
              <div
                className="w-full cursor-pointer"
                onClick={() => setShowCottagePicker(true)}
              >
                <div
                  className={`p-3 border-2 w-full h-full rounded-lg transition-colors ${selectedCottage ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-green-400"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${selectedCottage ? "bg-green-200" : "bg-slate-200"}`}
                    >
                      <Home
                        className={`w-5 h-5 ${selectedCottage ? "text-green-700" : "text-[#027a02]"}`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Cottage</p>
                      <p
                        className={`text-sm font-medium ${selectedCottage ? "text-green-800" : "text-gray-400"}`}
                      >
                        {selectedCottage
                          ? selectedCottage.name
                          : "Select cottage →"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DATE PICKER */}
            <div
              className="w-full cursor-pointer"
              onClick={() => {
                if (showMultiPicker && !selectedCottage) {
                  setShowCottagePicker(true);
                } else {
                  setOpenDateRange(true);
                }
              }}
            >
              <div className="p-3 border-2 w-full h-full border-gray-200 rounded-lg bg-gray-50 hover:border-green-400 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#027a02]" />
                  </div>
                  <div className="text-left flex flex-col items-start">
                    <div className="flex gap-2 justify-start">
                      <p className="text-sm text-gray-500">
                        {t("checkin_label", "Check-in")}:
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {bookDays.startDate || "—"}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-start">
                      <p className="text-sm text-gray-500">
                        {t("checkout_label", "Check-out")}:
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {bookDays.endDate || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GUEST COUNT */}
            <div className="p-2 border-2 w-full border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-slate-200 rounded-lg">
                  <Users className="w-5 h-5 text-[#027a02]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs text-gray-500">
                    {t("guests_label", "Guests")}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {guestCount} {t("guests_label", "Guests")}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => setGuestCount((g) => Math.min(g + 1, 20))}
                    className="p-0.5 rounded hover:bg-gray-200 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => setGuestCount((g) => Math.max(g - 1, 1))}
                    className="p-0.5 rounded hover:bg-gray-200 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* TOTAL COST */}
            <div
              className={`p-2 flex items-center gap-3 border-2 w-full rounded-lg transition-all duration-300 ${totalPrice > 0 ? "border-green-400 bg-green-50 shadow-md" : "border-gray-200 bg-gray-50"}`}
            >
              <div
                className={`p-2 rounded-lg transition-colors ${totalPrice > 0 ? "bg-green-200" : "bg-slate-200"}`}
              >
                <span
                  className={`text-base font-bold leading-none ${totalPrice > 0 ? "text-green-700" : "text-[#027a02]"}`}
                >
                  ₾
                </span>
              </div>
              <div className="text-left flex flex-col">
                <p className="text-xs text-gray-500">
                  {t("total_cost_label", "Total Cost")}
                </p>
                <p
                  className={`font-bold transition-all duration-300 ${totalPrice > 0 ? "text-xl text-green-700" : "text-xl text-gray-800"}`}
                >
                  {totalPrice > 0 ? `₾${totalPrice}` : nights > 0 ? "—" : "₾0"}
                </p>
              </div>
            </div>

            {/* BOOK NOW */}
            <Button
              variant="customGreen"
              className="text-nowrap"
              onClick={() => {
                if (showMultiPicker && !selectedCottage) {
                  setShowCottagePicker(true);
                } else if (!bookDays.startDate || !bookDays.endDate) {
                  setOpenDateRange(true);
                } else {
                  setOpenBookingModal(true);
                }
              }}
            >
              {t("hero_btn", "Book Now")}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
