"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Star, Users, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventHallsPage from "./EventHallFilter"; // Filter Component
import { useRouter } from "next/navigation"; // ← н

export default function EventHalls() {
  const [originalHalls, setOriginalHalls] = useState<any[]>([]);
  const [filteredHalls, setFilteredHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  // Fetch Data
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/event-halls");
        const data = await res.json();
        console.log({ data });

        if (data) {
          setOriginalHalls(data.data);
          setFilteredHalls(data.data);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    getData();
  }, []);

  // Auto-close filter on mobile after applied
  useEffect(() => {
    if (isFilterOpen) setIsFilterOpen(false);
  }, [filteredHalls]);
  console.log({ filteredHalls });
  return (
    <div className="w-full min-h-screen mt-30 bg-black text-white flex flex-col md:flex-row gap-8 md:px-10">
      {/* Filter Section */}
      <div className="w-full md:w-72 shrink-0">
        {/* Mobile Button */}
        <div className="md:hidden px-4">
          <Button
            onClick={() => setIsFilterOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800"
          >
            <SlidersHorizontal size={16} /> Filter
          </Button>
        </div>

        {/* Mobile Overlay */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex justify-center items-start pt-24 md:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <div
              className="bg-neutral-900 p-6 rounded-lg w-11/12 max-w-sm max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <EventHallsPage
                originalData={originalHalls}
                onFilterChange={setFilteredHalls}
              />
            </div>
          </div>
        )}

        {/* Desktop Filter */}
        <div className="hidden md:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <EventHallsPage
            originalData={originalHalls}
            onFilterChange={setFilteredHalls}
          />
        </div>
      </div>

      {/* Event Halls List */}
      <div className="flex flex-wrap justify-center gap-4 flex-1 px-4">
        {/* SKELETON LOADING */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[calc(50%-0.5rem)] md:w-[calc(33%-1rem)] xl:w-[calc(25%-1rem)]
                bg-neutral-900 rounded-2xl animate-pulse overflow-hidden"
            >
              <div className="h-56 bg-neutral-800"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-800 rounded"></div>
                <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
                <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                <div className="h-10 bg-neutral-800 rounded-lg mt-4"></div>
              </div>
            </div>
          ))}

        {!loading &&
          filteredHalls.map((hall) => (
            <div
              key={hall.id}
              className="w-[calc(50%-0.5rem)] md:w-[calc(33%-1rem)] xl:w-[calc(25%-1rem)]
              bg-neutral-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition"
            >
              <div className="relative w-full h-56">
                <Image
                  src={
                    hall.image ||
                    "https://img.freepik.com/premium-vector/image-icon-design-vector-template_1309674-943.jpg"
                  }
                  alt={hall.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 space-y-3">
                <h2 className="text-xl font-semibold">{hall.name}</h2>

                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-gray-400 truncate">
                    <MapPin size={18} />
                    <p>{hall.location}</p>
                  </div>

                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star size={18} />
                    <p>{hall.rating}</p>
                  </div>
                </div>

                <div className="flex justify-between text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <p>{hall.capacity} хүн</p>
                  </div>
                  <p>{hall.price} $</p>
                </div>

                <Button
                  onClick={() => router.push(`/event-halls/${hall.id}`)}
                  className="w-full border rounded-xl mt-3"
                >
                  Дэлгэрэнгүй
                </Button>
              </div>
            </div>
          ))}

        {!loading && filteredHalls.length === 0 && (
          <p className="text-neutral-400 mt-10">No event halls found.</p>
        )}
      </div>
    </div>
  );
}
