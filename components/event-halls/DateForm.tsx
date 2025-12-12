"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DateFormProps {
  selected: { date: string; type: "am" | "pm" | "udur" }[];
  setSelected: React.Dispatch<
    React.SetStateAction<{ date: string; type: "am" | "pm" | "udur" }[]>
  >;
  hallId: number | string;
}

export default function DateForm({
  selected,
  hallId,
  setSelected,
}: DateFormProps) {
  const [prices, setPrices] = useState<{
    am: number;
    pm: number;
    udur: number;
  }>({
    am: 0,
    pm: 0,
    udur: 0,
  });

  useEffect(() => {
    if (!hallId) return;
    const getPrices = async () => {
      try {
        const res = await fetch(`/api/event-halls/prices?hallId=${hallId}`);
        const data = await res.json();
        setPrices({
          am: data.price?.[0] ?? 0,
          pm: data.price?.[1] ?? 0,
          udur: data.price?.[2] ?? 0,
        });
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };
    getPrices();
  }, [hallId]);

  const calculateTotalPrice = () =>
    selected.reduce((total, sel) => total + prices[sel.type], 0);

  const handleSubmit = async () => {
    if (selected.length === 0) return toast.error("Өдөр сонгоно уу");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Захиалга хийхийн тулд нэвтэрнэ үү");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hallId, bookings: selected }),
      });

      if (res.ok) {
        toast.success("Захиалга амжилттай илгээгдлээ");
      } else {
        const errData = await res.json();
        toast.error("Алдаа гарлаа: " + (errData.error || "Серверийн алдаа"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Серверийн алдаа гарлаа");
    }
  };

  const timeLabels = {
    am: "Өглөө 08:00 - 12:00",
    pm: "Орой 18:00 - 22:00",
    udur: "Өдөр 09:00 - 18:00",
  };

  return (
    <Card className="w-full md:w-2/3 p-6 px-3 h-fit sticky top-6 bg-neutral-900 border-neutral-700 shadow-lg justify-center items-center">
      <h3 className="text-xl font-bold mb-4 text-white">Сонгосон цагууд</h3>

      {selected.length === 0 ? (
        <p className="text-gray-400 text-sm">Цаг сонгоогүй байна</p>
      ) : (
        <div className="space-y-3 mb-1 w-full">
          {selected.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-neutral-800 rounded-lg border border-neutral-700 flex w-full justify-between items-start"
            >
              <div>
                <div className="font-semibold text-white">
                  {new Date(item.date).toLocaleDateString("mn-MN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {timeLabels[item.type]}
                </div>
                <div className="text-green-400 font-semibold mt-1">
                  {prices[item.type].toLocaleString()}₮
                </div>
              </div>
              {/* Delete Button */}
              <button
                onClick={() =>
                  setSelected((prev) =>
                    prev.filter(
                      (s) => !(s.date === item.date && s.type === item.type)
                    )
                  )
                }
                className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl"
                title="Устгах"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="space-y-2 flex flex-col items-center">
          <div className="text-lg font-bold text-white mb-2 justify-center">
            Нийт үнэ: {calculateTotalPrice().toLocaleString()}₮
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            Захиалга батлах ({selected.length})
          </Button>
        </div>
      )}
    </Card>
  );
}
