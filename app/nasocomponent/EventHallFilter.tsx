"use client";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface Hall {
  id: number;
  name: string;
  location: string;
  duureg: string;
  capacity: string;
  rating: number | string;
  price: number | number[];
  images: string[];
}

const PRICE = [
  "500,000",
  "1,000,000",
  "1,500,000",
  "2,000,000",
  "3,000,000",
  "5,000,000",
];

interface EventHallsPageProps {
  originalData: Hall[];
  onFilterChange: (filtered: Hall[]) => void;
}

export default function EventHallsPage({
  originalData,
  onFilterChange,
}: EventHallsPageProps) {
  const MIN = 500;
  const MAX = 10000000;

  const [district, setDistrict] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState<number>(MAX);
  const [openPrice, setOpenPrice] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    const uniqueDistricts = Array.from(
      new Set(originalData.map((hall) => hall.duureg))
    );
    setDistricts(uniqueDistricts);
  }, [originalData]);

  useEffect(() => {
    applyFilters();
  }, [district, price, capacity]);

  const applyFilters = () => {
    let filtered = [...originalData];

    if (district) {
      filtered = filtered.filter((hall) => hall.duureg === district);
    }

    if (capacity) {
      filtered = filtered.filter((hall) => {
        const [maxCap] = String(hall.capacity).split("-").map(Number);
        return maxCap <= Number(capacity);
      });
    }

    if (price < MAX) {
      filtered = filtered.filter((hall) => {
        const hallPrice = Array.isArray(hall.price)
          ? Math.min(...hall.price)
          : hall.price;
        return hallPrice <= price;
      });
    }

    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setDistrict("");
    setCapacity("");
    setPrice(MAX);
    onFilterChange(originalData);
  };

  const parsePrice = (str: string) => Number(str.replace(/,/g, ""));

  return (
    <aside className="w-100 bg-neutral-900 text-gray-200 mt-[-15] rounded-2xl p-6 shadow-lg relative">
      <h2 className="text-2xl font-semibold mb-6">Filter Event Halls</h2>

      {/* Дүүрэг */}
      <div className="mb-4 relative">
        <label className="block mb-1">Дүүрэг</label>
        <div
          className="bg-[#2A2B2F] rounded-xl p-3 cursor-pointer"
          onClick={() => setOpenDistrict(!openDistrict)}
        >
          {district || "Дүүрэг сонгох…"}
        </div>
        {openDistrict && (
          <div className="absolute z-20 mt-2 w-full bg-[#444548] rounded-xl shadow-xl py-2">
            {districts.map((d) => (
              <div
                key={d}
                onClick={() => {
                  setDistrict(d);
                  setOpenDistrict(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-white/10 flex justify-between items-center"
              >
                <span>{d}</span>
                {district === d && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Үнэ */}
      <div className="mb-4 relative">
        <label className="block mb-1">Хамгийн их</label>
        <div
          className="bg-[#2A2B2F] rounded-xl p-3 cursor-pointer"
          onClick={() => setOpenPrice(!openPrice)}
        >
          {price === MAX ? "Үнэ сонгох" : `${price.toLocaleString()}₮`}
        </div>
        {openPrice && (
          <div className="absolute z-20 mt-2 w-full bg-[#444548] rounded-xl shadow-xl py-2">
            {PRICE.map((p) => (
              <div
                key={p}
                onClick={() => {
                  const numericPrice = parsePrice(p);
                  setPrice(numericPrice);
                  setOpenPrice(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-white/10 flex justify-between items-center"
              >
                <span>{p}₮</span>
                {price === parsePrice(p) && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Багтаамж */}
      <div className="mb-6">
        <label className="block mb-1">Багтаамж</label>
        <div className="flex items-center gap-2 bg-[#2A2B2F] p-2 rounded-[13px]">
          <Users className="text-gray-400" />
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Min. guests"
            className="bg-transparent outline-none w-full text-gray-200"
          />
        </div>
      </div>

      {/* RESET BUTTON */}
      <div className="flex gap-3 mt-6">
        <button
          className="bg-neutral-800 text-white py-3 rounded-xl w-full hover:bg-neutral-700"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
