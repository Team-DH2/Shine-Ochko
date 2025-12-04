"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DateForm = ({
  hallId,
  selected,
}: {
  hallId: string | number;
  selected: { date: string; type: "am" | "pm" | "udur" }[];
}) => {
  const mockPrices: { [key: string]: number } = {
    am: 50000, // 08:00-12:00
    pm: 60000, // 18:00-22:00
    udur: 150000, // 09:00-18:00
  };
  const calculateTotalPrice = () => {
    return selected.reduce((total, sel) => total + mockPrices[sel.type], 0);
  };
  const router = useRouter();
  const handleSubmit = async () => {
    if (selected.length === 0) return alert("Өдөр сонгоно уу");

    const bookingData = {
      hallId,
      bookings: selected,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        alert("Захиалга амжилттай илгээгдлээ");
        router.push(`/dashboard`);
      } else {
        alert("Алдаа гарлаа");
      }
    } catch (error) {
      console.error(error);
      alert("Серверийн алдаа гарлаа");
    }
  };

  return (
    <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-sm border h-fit">
      <h1 className="text-3xl font-bold text-[#0A1633] mb-6">
        Захиалгын хүсэлт
      </h1>

      <div className="mb-4">
        <label className="text-lg font-semibold text-[#0A1633]">
          Захиалгын өдөр
        </label>
        <div className="mt-2 p-4 border rounded-lg bg-gray-50 text-[#0A1633] text-lg">
          {selected.length > 0
            ? selected.map((s: any, idx: number) => (
                <div key={idx}>
                  {s.date} (
                  {s.type === "am"
                    ? "08:00-12:00"
                    : s.type === "udur"
                    ? "09:00-18:00"
                    : "18:00-22:00"}
                  )
                </div>
              ))
            : "Өдөр сонгоогүй"}
        </div>
      </div>
      <div className="mb-4">
        <label className="text-lg font-semibold text-[#0A1633]">
          <h3 className="font-semibold text-lg">Сонгосон цагийн нийт үнэ:</h3>
        </label>
        <div className="mt-2 p-4 border rounded-lg bg-gray-50 text-[#0A1633] text-lg">
          {selected.length > 0 ? (
            <div className="mt-4 p-4 border rounded-md bg-white">
              <p className="text-xl font-bold text-green-600">
                {calculateTotalPrice().toLocaleString()}₮
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 border rounded-md bg-white">
              <p className="text-xl font-bold text-green-600">0₮</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 text-white bg-[#3B5BDB] hover:bg-[#314CC7] rounded-lg text-xl font-semibold transition"
      >
        Zahialah
      </button>
    </div>
  );
};

export default DateForm;
