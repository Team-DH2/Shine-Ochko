/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import generateCalendar from "@/lib/generatecalendar";
import DateForm from "./DateForm";
import { publicFetcher } from "@/lib/fetcherpublic";
import useSWR from "swr";

interface TimeSlotBooking {
  date: string;
  starttime: string;
  hallid: number | string;
  price?: number;
  salePrice?: number;
}

export function BookingCalendar({
  hallId,
  eventHallData,
  isOwner,
}: {
  hallId: number | string;
  eventHallData: any;
  isOwner?: boolean;
}) {
  const { data, isLoading } = useSWR("/api/booking-all", publicFetcher);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<
    { date: string; type: "am" | "pm" | "udur" }[]
  >([]);

  // States for dialog editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    date: string;
    type: "am" | "pm" | "udur";
    label: string;
  } | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [isSale, setIsSale] = useState<boolean>(false);
  const [cellPrices, setCellPrices] = useState<
    Record<string, { am?: number; pm?: number; udur?: number }>
  >({});
  const [cellSales, setCellSales] = useState<
    Record<string, { am?: boolean; pm?: boolean; udur?: boolean }>
  >({});
  const [cellBookings, setCellBookings] = useState<
    Record<string, { am?: boolean; pm?: boolean; udur?: boolean }>
  >({});

  const bookings: TimeSlotBooking[] =
    data?.filter((b: TimeSlotBooking) => b.hallid == hallId) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

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

  const handleStartEdit = (
    dateStr: string,
    type: "am" | "pm" | "udur",
    label: string
  ) => {
    setEditingCell({ date: dateStr, type, label });

    // Get custom price if set, otherwise use default from eventHallData
    let currentPrice = cellPrices[dateStr]?.[type];

    if (currentPrice === undefined && eventHallData?.price) {
      const priceIndex = type === "am" ? 0 : type === "pm" ? 1 : 2;
      currentPrice = eventHallData.price[priceIndex] || 0;
    }

    const saleStatus = cellSales[dateStr]?.[type] || false;

    setEditPrice((currentPrice || 0).toString());
    setIsSale(saleStatus);
    setEditDialogOpen(true);
  };

  const handleSavePrice = async () => {
    if (!editingCell) return;

    const price = parseInt(editPrice) || 0;
    const { date, type } = editingCell;

    setCellPrices((prev) => ({
      ...prev,
      [date]: { ...prev[date], [type]: price },
    }));

    setCellSales((prev) => ({
      ...prev,
      [date]: { ...prev[date], [type]: isSale },
    }));

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`/api/hallowner/my-halls/${hallId}/pricing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date, timeSlot: type, price, hallId }),
        });
      }
    } catch (error) {
      console.error("Error saving price:", error);
    }

    setEditDialogOpen(false);
    setEditingCell(null);
    setEditPrice("");
    setIsSale(false);
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingCell(null);
    setEditPrice("");
    setIsSale(false);
  };

  const handleBookSlot = async () => {
    if (!editingCell || isOwner) return; // Owners only edit prices
    const { date, type } = editingCell;

    setCellBookings((prev) => ({
      ...prev,
      [date]: { ...prev[date], [type]: true },
    }));

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`/api/hallowner/my-halls/${hallId}/book`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date, timeSlot: type }),
        });
      }
    } catch (error) {
      console.error("Error booking slot:", error);
    }

    setEditDialogOpen(false);
    setEditingCell(null);
    setEditPrice("");
    setIsSale(false);
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
      (b) => b.date.split("T")[0] === dateStr
    );

    const isAmBooked = dayBookings.some(
      (b) => Number(b.starttime.split(":")[0]) === 8
    );
    const isPmBooked = dayBookings.some(
      (b) => Number(b.starttime.split(":")[0]) === 18
    );
    const isUdureBooked = dayBookings.some(
      (b) => Number(b.starttime.split(":")[0]) === 9
    );
    const isManuallyBooked = cellBookings[dateStr]?.[type] || false;

    let isAvailable = !isPast;
    if (
      (type === "am" && (isAmBooked || isUdureBooked || isManuallyBooked)) ||
      (type === "pm" && (isPmBooked || isUdureBooked || isManuallyBooked)) ||
      (type === "udur" &&
        (isUdureBooked || isAmBooked || isPmBooked || isManuallyBooked))
    ) {
      isAvailable = false;
    }

    const isSelected = selected.some(
      (s) => s.date === dateStr && s.type === type
    );
    const customSaleStatus = cellSales[dateStr]?.[type];
    const displayPrice =
      cellPrices[dateStr]?.[type] ??
      (eventHallData?.price
        ? eventHallData.price[type === "am" ? 0 : type === "pm" ? 1 : 2]
        : 0);

    // Check if this slot has a sale
    // const hasSale = salePrice !== undefined && salePrice > 0;

    const handleSelect = () => {
      if (!isAvailable || isPast) return;
      setSelected((prev) => {
        const exists = prev.find((s) => s.date === dateStr && s.type === type);
        if (exists)
          return prev.filter((s) => !(s.date === dateStr && s.type === type));
        return [...prev, { date: dateStr, type }];
      });
    };

    if (isOwner && !isPast) {
      return (
        <button
          onClick={() => handleStartEdit(dateStr, type, label)}
          className={`w-full rounded-md border p-1 text-center text-[10px] sm:text-xs font-medium h-7 sm:h-8 flex items-center justify-between transition-all group ${
            customSaleStatus
              ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 hover:bg-emerald-500/20"
              : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-blue-500"
          }`}
        >
          <span className="flex-1">{label}</span>
          <div className="flex items-center gap-1">
            {displayPrice > 0 && (
              <span
                className={`text-[9px] ${
                  customSaleStatus ? "text-emerald-400" : "text-blue-400"
                }`}
              >
                {displayPrice.toLocaleString()}₮
              </span>
            )}
            <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      );
    }

    return (
      <button
        onClick={handleSelect}
        disabled={!isAvailable || isPast}
        className={`w-full rounded-md border p-1 text-center text-[10px] sm:text-xs font-medium h-7 sm:h-8 flex items-center justify-center transition-all ${
          isSelected
            ? "bg-white text-black border-white"
            : customSaleStatus && isAvailable
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 hover:bg-emerald-500/30"
            : isAvailable
            ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
            : "bg-neutral-950 text-neutral-700 border-neutral-900 cursor-not-allowed line-through"
        }`}
      >
        {label}
      </button>
    );
  };

  const daysOfWeek = ["Да", "Мя", "Лха", "Пү", "Ба", "Бя", "Ня"];
  const weeks = generateCalendar(currentYear, currentMonth);
  const monthNames = [
    "1-р сар",
    "2-р сар",
    "3-р сар",
    "4-р сар",
    "5-р сар",
    "6-р сар",
    "7-р сар",
    "8-р сар",
    "9-р сар",
    "10-р сар",
    "11-р сар",
    "12-р сар",
  ];

  return (
    <>
      {/* Edit Price Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Үнэ засах</DialogTitle>
            <DialogDescription>
              {editingCell && (
                <>
                  <div className="text-sm">Огноо: {editingCell.date}</div>
                  <div className="text-sm">Цаг: {editingCell.label}</div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Үнэ (₮)</label>
              <Input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="mt-2"
                placeholder="Үнэ оруулах"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSavePrice();
                }}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="sale-mode" className="text-sm font-medium">
                  Хямдрал
                </Label>
                <p className="text-xs text-muted-foreground">
                  Хямдралтай бол ногоон өнгөөр харагдана
                </p>
              </div>
              <Switch
                id="sale-mode"
                checked={isSale}
                onCheckedChange={setIsSale}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              Цуцлах
            </Button>
            {isOwner ? (
              <Button
                onClick={handleSavePrice}
                className="flex-1 sm:flex-initial"
              >
                Хадгалах
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleBookSlot}
                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700"
                disabled={
                  editingCell
                    ? !!(
                        cellBookings[editingCell.date]?.[editingCell.type] ||
                        bookings.some(
                          (b) =>
                            new Date(b.date).toISOString().split("T")[0] ===
                              editingCell.date &&
                            ((editingCell.type === "am" &&
                              Number(b.starttime.split(":")[0]) === 8) ||
                              (editingCell.type === "pm" &&
                                Number(b.starttime.split(":")[0]) === 18) ||
                              (editingCell.type === "udur" &&
                                Number(b.starttime.split(":")[0]) === 9))
                        )
                      )
                    : false
                }
              >
                Захиалах
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="w-full lg:flex-1 border border-neutral-800 rounded-xl p-4 lg:p-6 bg-black relative group">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {currentYear} оны {monthNames[currentMonth]}
              {isOwner && (
                <span className="ml-3 text-xs text-blue-400 font-normal">
                  Нүдэнд дарж үнэ оруулах
                </span>
              )}
            </h2>
            <div className="flex gap-1 items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevMonth}
                className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMonth}
                className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-neutral-900 border border-neutral-800" />
              <span>Сул</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white" />
              <span>Сонгосон</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-neutral-950 border border-neutral-900" />
              <span>Боломжгүй</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500" />
              <span className="text-emerald-400">Хямдралтай</span>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center font-medium text-neutral-500 mb-2 text-xs">
            {daysOfWeek.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {weeks.map((week: { day: number; current: boolean }[], i: number) =>
              week.map((dayObj, j) => {
                const { day, current } = dayObj;
                if (!current)
                  return (
                    <div
                      key={`${i}-${j}`}
                      className="min-h-[90px] sm:min-h-[100px] bg-neutral-950 rounded-lg p-1.5 text-neutral-700 text-xs"
                    >
                      <div className="font-medium">{day}</div>
                    </div>
                  );

                return (
                  <div
                    key={`${i}-${j}`}
                    className={`min-h-[90px] sm:min-h-[100px] border rounded-lg p-1.5 flex flex-col gap-1 transition-colors ${
                      new Date(
                        `${currentYear}-${currentMonth + 1}-${day}`
                      ).getTime() < new Date(todayStr).getTime()
                        ? "bg-neutral-950 border-neutral-900"
                        : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold mb-0.5 ${
                        new Date(
                          `${currentYear}-${currentMonth + 1}-${day}`
                        ).getTime() < new Date(todayStr).getTime()
                          ? "text-neutral-600"
                          : "text-neutral-300"
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

        <div className="w-full lg:w-80">
          <DateForm
            eventHallData={eventHallData}
            selected={selected}
            setSelected={setSelected}
            hallId={hallId}
          />
        </div>
      </div>
    </>
  );
}
