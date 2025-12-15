/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DateForm from "./DateForm";

import useSWR from "swr";
import { publicFetcher } from "@/lib/fetcherpublic";
import generateCalendar from "@/lib/utilfunction/GenerateCalendar";

export default function BookingCalendar({
  hallId,
  isOwner = false,
  onEditCalendar,
}: {
  hallId: number | string;
  isOwner?: boolean;
  onEditCalendar?: () => void;
}) {
  const { data, isLoading } = useSWR("/api/booking-all", publicFetcher);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<
    { date: string; type: "am" | "pm" | "udur" }[]
  >([]);

  const bookings = data?.filter((b: any) => b.hallid == hallId) || [];

  if (isLoading) return <p className="text-white">Уншиж байна...</p>;

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const TimeBox = ({
    type,
    day,
  }: {
    type: "am" | "pm" | "udur";
    day: number;
  }) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    const labelMap = {
      am: "08:00-12:00",
      pm: "18:00-22:00",
      udur: "09:00-18:00",
    };
    const label = labelMap[type];

    const isPast = new Date(dateStr).getTime() < new Date(todayStr).getTime();
    const dayBookings = bookings.filter(
      (b: any) => new Date(b.date).toISOString().split("T")[0] === dateStr
    );

    const isAmBooked = dayBookings.some(
      (b: { starttime: string }) =>
        Number.parseInt(b.starttime.split(":")[0], 10) === 8
    );
    const isPmBooked = dayBookings.some(
      (b: { starttime: string }) =>
        Number.parseInt(b.starttime.split(":")[0], 10) === 18
    );
    const isUdureBooked = dayBookings.some(
      (b: { starttime: string }) =>
        Number.parseInt(b.starttime.split(":")[0], 10) === 9
    );

    let isAvailable = !isPast;
    if (
      (type === "am" && (isAmBooked || isUdureBooked)) ||
      (type === "pm" && (isPmBooked || isUdureBooked)) ||
      (type === "udur" && (isUdureBooked || isAmBooked || isPmBooked))
    ) {
      isAvailable = false;
    }

    const isSelected = selected.some(
      (sel) => sel.date === dateStr && sel.type === type
    );

    const handleSelect = () => {
      if (!isAvailable || isPast) return;
      setSelected((prev) => {
        const exists = prev.find((s) => s.date === dateStr && s.type === type);
        if (exists) {
          return prev.filter((s) => !(s.date === dateStr && s.type === type));
        }
        return [...prev, { date: dateStr, type }];
      });
    };

    return (
      <button
        onClick={handleSelect}
        disabled={!isAvailable || isPast}
        className={`w-full rounded-lg border p-1 text-center text-xs font-medium h-8 sm:h-9 flex items-center justify-center transition-all ${
          isSelected
            ? "bg-blue-600 text-white shadow-lg scale-[1.02] border-blue-600"
            : isAvailable
            ? "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700 hover:border-blue-600 hover:shadow-sm"
            : "bg-red-900 text-red-200 border-red-800 cursor-not-allowed"
        }`}
      >
        {isPast ? "Дууссан" : isAvailable ? label : "Захиалгатай"}
      </button>
    );
  };

  const daysOfWeek = [
    "Даваа",
    "Мягмар",
    "Лхагва",
    "Пүрэв",
    "Баасан",
    "Бямба",
    "Ням",
  ];
  const weeks = generateCalendar(currentYear, currentMonth);

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 lg:p-6 w-full max-w-screen-2xl mx-auto">
      {/* Calendar Section */}
      <div className="w-full lg:w-2/3 border border-neutral-700 rounded-lg p-4 lg:p-6 bg-neutral-900 shadow-lg overflow-x-auto relative">
        {isOwner && (
          <button
            onClick={onEditCalendar}
            className="absolute bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg"
          >
            <Edit className="w-4 h-4" />
            Засах
          </button>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            {currentYear} – {currentMonth + 1} сар
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={prevMonth}
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent text-sm sm:text-base py-2"
            >
              ‹ Өмнөх сар
            </Button>
            <Button
              variant="outline"
              onClick={nextMonth}
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent text-sm sm:text-base py-2"
            >
              Дараах сар ›
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center font-semibold text-gray-300 mb-2 text-xs sm:text-sm lg:text-sm">
          {daysOfWeek.map((d) => (
            <div key={d} className="py-1 lg:py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weeks.map((week: any[], i: number) =>
            week.map((dayObj, j) => {
              const { day, current } = dayObj;
              if (!current) {
                return (
                  <div
                    key={j}
                    className="min-h-[100px] sm:min-h-[110px] bg-neutral-800 rounded-lg p-1 sm:p-2 text-neutral-500 text-xs sm:text-sm"
                  >
                    <div className="text-sm font-medium">{day}</div>
                  </div>
                );
              }

              const dateStr = `${currentYear}-${String(
                currentMonth + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPast =
                new Date(dateStr).getTime() < new Date(todayStr).getTime();
              const dayBookings = bookings.filter(
                (b: { date: string }) =>
                  new Date(b.date).toISOString().split("T")[0] === dateStr
              );
              const isUdureBooked = dayBookings.some(
                (b: { starttime: string }) =>
                  Number.parseInt(b.starttime.split(":")[0], 10) === 9
              );

              return (
                <div
                  key={j}
                  className={`min-h-[100px] sm:min-h-[120px] border rounded-lg p-1 sm:p-2 flex flex-col gap-1.5 transition-colors ${
                    isPast
                      ? "bg-neutral-900 border-neutral-700"
                      : isUdureBooked
                      ? "bg-red-950/30 border-red-800"
                      : "bg-neutral-800 border-neutral-700 hover:border-blue-600"
                  }`}
                >
                  <div
                    className={`text-xs sm:text-sm font-semibold mb-0.5 ${
                      isPast
                        ? "text-neutral-500"
                        : isUdureBooked
                        ? "text-red-400"
                        : "text-white"
                    }`}
                  >
                    {day}
                  </div>
                  <TimeBox type="am" day={day} />
                  <TimeBox type="pm" day={day} />
                  <TimeBox type="udur" day={day} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DateForm Section */}
      <div className="w-full lg:w-1/3">
        <DateForm
          selected={selected}
          setSelected={setSelected}
          hallId={hallId}
        />
      </div>
    </div>
  );
}
