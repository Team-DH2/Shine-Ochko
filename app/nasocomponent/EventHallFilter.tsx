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
  additional_informations?: string[];
  advantages?: string[];
  informations_about_hall?: string[];
  location_link?: string;
  menu?: string[];
  parking_capacity?: number;
  phonenumber?: string;
  suitable_events?: string[];
  created_at?: string;
  description?: string;
}

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

  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(MAX);
  const [capacity, setCapacity] = useState("");
  const [openLoc, setOpenLoc] = useState(false);
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);

  const applyFilters = () => {
    let filtered = [...originalData];

    // Location filter
    if (location) {
      filtered = filtered.filter((hall) =>
        hall.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Capacity filter
    if (capacity) {
      filtered = filtered.filter((hall) => {
        const [maxCap] = String(hall.capacity).split("-").map(Number);
        return maxCap >= Number(capacity);
      });
    }

    // Price filter
    if (price && price < MAX) {
      filtered = filtered.filter((hall) => {
        const hallPrice = Array.isArray(hall.price)
          ? Math.min(...hall.price)
          : hall.price;
        return hallPrice <= price;
      });
    }

    // District filter
    if (district) {
      filtered = filtered.filter((hall) => hall.duureg === district);
    }

    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setLocation("");
    setPrice(MAX);
    setCapacity("");
    setOpenLoc(false);
    onFilterChange(originalData);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/event-halls");
        const data = await res.json();
      } catch (e) {
        console.error(e);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const uniqueDistricts = Array.from(
      new Set(originalData.map((hall) => hall.duureg))
    );
    setDistricts(uniqueDistricts);
  }, [originalData]);

  return (
    <aside className="w-100 bg-neutral-900 text-gray-200 rounded-2xl p-6 shadow-lg relative">
      <h2 className="text-2xl font-semibold mb-6">Filter Event Halls</h2>

      {/* Location */}
      <label className="block mb-6 relative">
        <div className="mb-2 text-gray-300">Location</div>
        <button
          onClick={() => setOpenLoc(!openLoc)}
          className="w-full bg-[#2A2B2F] px-3 py-3 rounded-xl flex justify-between items-center text-left"
        >
          {/* Persist last selected location */}
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
            {districts.map((d) => (
              <div
                key={d}
                onClick={() => {
                  setDistrict(d);
                  setOpenLoc(false);
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
          className=" text-white py-3 rounded-xl w-full bg-neutral-800 hover:bg-neutral-700  transition-colors"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
