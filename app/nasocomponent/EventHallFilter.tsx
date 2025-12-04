"use client";
import { useState } from "react";
import { Users } from "lucide-react";

interface Hall {
  id: number;
  name: string;
  location: string;
  capacity: string;
  rating: number;
  price: number;
  image: string;
}

const LOCATIONS = [
  "Баянгол",
  "Баянзүрх",
  "Сонгино хайрхан",
  "Сүхбаатар",
  "Хан-Уул",
  "Чингэлтэй",
];

interface EventHallsPageProps {
  originalData: Hall[]; // API-аас ирсэн дата
  onFilterChange: (filtered: Hall[]) => void;
}

export default function EventHallsPage({
  originalData,
  onFilterChange,
}: EventHallsPageProps) {
  const MIN = 500;
  const MAX = 5000;

  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(MAX);
  const [capacity, setCapacity] = useState("");
  const [openLoc, setOpenLoc] = useState(false);

  const applyFilters = () => {
    let filtered = [...originalData];
    console.log({ filtered });
    console.log({ location });

    if (location) {
      filtered = filtered.filter((hall) =>
        hall.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (capacity) {
      filtered = filtered.filter((hall) => {
        const [maxCap] = String(hall.capacity).split("-").map(Number);
        return maxCap >= Number(capacity);
      });
    }

    filtered = filtered.filter((hall) => hall.price <= price);

    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setLocation("");
    setPrice(MAX);
    setCapacity("");
    setOpenLoc(false);
    onFilterChange(originalData); // API дата буцааж харуулна
  };

  return (
    <aside className="w-full bg-[#1F2024] text-gray-200 rounded-2xl p-6 shadow-lg border border-[#2f2f36] relative">
      <h2 className="text-2xl font-semibold mb-6">Filter Event Halls</h2>

      {/* Location */}
      <label className="block mb-6 relative">
        <div className="mb-2 text-gray-300">Location</div>
        <button
          onClick={() => setOpenLoc(!openLoc)}
          className="w-full bg-[#2A2B2F] px-3 py-3 rounded-xl flex justify-between items-center text-left"
        >
          <span className="text-gray-300">{location || "Сум/дүүрэг…"}</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              openLoc ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openLoc && (
          <div className="absolute z-20 mt-2 w-full bg-[#444548] rounded-xl shadow-xl py-2">
            {LOCATIONS.map((loc) => (
              <div
                key={loc}
                onClick={() => {
                  setLocation(loc);
                  setOpenLoc(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-white/10 flex justify-between items-center"
              >
                <span>{loc}</span>
                {location === loc && (
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
      </label>

      {/* Price */}
      <div className="mb-4">
        <label className="block mb-1">Max Price</label>
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="mt-1 text-gray-200">{price}$</div>
      </div>

      {/* Capacity */}
      <div className="mb-6">
        <label className="block mb-1">Min Capacity</label>
        <div className="flex items-center gap-2 bg-[#2A2B2F] p-2 rounded-[13px]">
          <Users className="text-gray-400" />
          <input
            type="number"
            min={0}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Min. guests"
            className="bg-transparent outline-none w-full text-gray-200 
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white py-3 rounded-xl w-full hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>

        <button
          onClick={resetFilters}
          className="border border-blue-600 text-blue-400 py-3 rounded-xl w-full hover:bg-blue-600 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
