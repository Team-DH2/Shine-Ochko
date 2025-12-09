"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Star, Users, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventHallsPage from "./EventHallFilter";
import { useRouter } from "next/navigation";

export default function EventHalls() {
  const [originalHalls, setOriginalHalls] = useState<any[]>([]);
  const [filteredHalls, setFilteredHalls] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/event-halls");
        const data = await res.json();
        console.log(data);

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

  useEffect(() => {
    if (isFilterOpen) setIsFilterOpen(false);
  }, [filteredHalls]);
  console.log({ filteredHalls });

  return (
    <div className="flex">
      <div className="w-full min-h-screen mt-20 bg-black text-white flex flex-col md:flex-row gap-6 md:px-9 px-5 md:38">
        {/* Filter Section */}
        <div className="w-full md:w-fit ">
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
              className="fixed inset-0 bg-black/80 z-50 flex justify-center w-full items-start pt-24 md:hidden"
              onClick={() => setIsFilterOpen(false)}
            >
              <div
                className="bg-transparent p-6 rounded-lg w-full max-h-[80vh] justify-center flex overflow-y-auto"
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
          <div className="hidden w-fit md:block sticky top-20 max-h-[calc(100vh-6rem)]">
            <EventHallsPage
              originalData={originalHalls}
              onFilterChange={setFilteredHalls}
            />
          </div>
        </div>

        {/* Event Halls List */}
        <div className="flex flex-wrap justify-center gap-5 flex-1">
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
                  <div className="h-4 bg-neutral-800 rounded" />
                  <div className="h-4 bg-neutral-800 rounded w-2/3" />
                  <div className="h-4 bg-neutral-800 rounded w-1/2" />
                  <div className="h-10 bg-neutral-800 rounded-lg mt-4" />
                </div>
              </div>
            ))}

          {!loading &&
            filteredHalls.map((hall) => (
              <div
                key={hall.id}
                className="w-[40%] flex-1 min-w-[280px] max-w-[400px] bg-neutral-900 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-200 flex flex-col"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={
                      hall.images[0] ||
                      "https://img.freepik.com/premium-vector/image-icon-design-vector-template_1309674-943.jpg"
                    }
                    alt={hall.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <h2 className="text-xl font-semibold">{hall.name}</h2>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-400 flex-1 min-w-0">
                      <MapPin size={18} />
                      <p className="truncate w-[90%]">{hall.location}</p>
                    </div>

                    <div className="flex items-center gap-2 text-yellow-400 ml-2">
                      <Star size={18} />
                      <p>{hall.rating}</p>
                    </div>
                  </div>

                  <div className="flex justify-between h-10 text-gray-400 items-center">
                    <div className="flex items-center gap-2">
                      <Users size={18} />
                      <p>{hall.capacity} хүн</p>
                    </div>
                    <p className="truncate w-[40%]">$ {hall.price}</p>
                  </div>

                  <Button
                    onClick={() => router.push(`/event-halls/${hall.id}`)}
                    className="w-full rounded-xl mt-3 bg-neutral-800 hover:bg-neutral-700"
                  >
                    Дэлгэрэнгүй
                  </Button>
                </div>
              </div>
            ))}

          {!loading && filteredHalls.length === 0 && (
            <p className="text-neutral-400 mt-3 lg:hidden  flex">
              No event halls found.
            </p>
          )}
          {!loading && filteredHalls.length === 0 && (
            <div className="md:hidden flex lg:flex">
              <p className="text-neutral-400   md:flex hidden fixed justify-center left-[50%] top-[10%] -translate-x-[50%] -translate-y-[50%]">
                No event halls found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
