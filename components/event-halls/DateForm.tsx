/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { X, Calendar, Clock } from "lucide-react";

interface DateFormProps {
  selected: { date: string; type: "am" | "pm" | "udur" }[];
  setSelected: React.Dispatch<
    React.SetStateAction<{ date: string; type: "am" | "pm" | "udur" }[]>
  >;
  hallId: number | string;
  eventHallData: any;
}

export default function DateForm({
  selected,
  setSelected,
  hallId,
  eventHallData,
}: DateFormProps) {
  const typeLabels = {
    am: "Өглөө (08:00-12:00)",
    pm: "Орой (18:00-22:00)",
    udur: "Өдөр (09:00-18:00)",
  };
  const slotPrices = {
    am: eventHallData.price[0],
    pm: eventHallData.price[1],
    udur: eventHallData.price[2],
  };

  const totalPrice = selected.reduce(
    (sum, sel) => sum + slotPrices[sel.type],
    0
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const removeSelection = (date: string, type: "am" | "pm" | "udur") => {
    setSelected((prev) =>
      prev.filter((s) => !(s.date === date && s.type === type))
    );
  };

  const handleSubmit = () => {
    console.log("Booking submitted:", { hallId, selected });
    // Handle booking submission
  };

  return (
    <div className="border border-neutral-800 rounded-xl p-4 lg:p-6 bg-black h-fit sticky top-6">
      <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Сонгосон цагууд
      </h3>

      {selected.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 text-sm">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Цаг сонгоогүй байна</p>
          <p className="text-xs mt-1">Календараас цагаа сонгоно уу</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {selected.map((sel, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {formatDate(sel.date)}
                </p>
                <p className="text-xs text-neutral-400">
                  {typeLabels[sel.type]}
                </p>
              </div>
              <button
                onClick={() => removeSelection(sel.date, sel.type)}
                className="p-1 hover:bg-neutral-800 rounded-md transition-colors"
              >
                <X className="h-4 w-4 text-neutral-500 hover:text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <>
          <div className="border-t border-neutral-800 pt-4 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Нийт сонголт</span>
              <span className="text-white font-medium">
                {selected.length} цаг
              </span>
            </div>

            {/* Total Price */}
            <div className="flex justify-between text-sm mt-2">
              <span className="text-neutral-400">Нийт үнэ</span>
              <span className="text-white font-semibold">{totalPrice}₮</span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-white text-black hover:bg-neutral-200 font-medium"
          >
            Захиалга баталгаажуулах
          </Button>
        </>
      )}
    </div>
  );
}
