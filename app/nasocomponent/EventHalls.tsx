/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Star, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventHallsPage from "./EventHallFilter";
import { useRouter } from "next/navigation";
import EventHallsSkeleton from "@/components/us/EventHallSkeleton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";

export default function EventHalls() {
  const [originalHalls, setOriginalHalls] = useState<any[]>([]);
  const [filteredHalls, setFilteredHalls] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/event-halls");
        const data = await res.json();

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

  return (
    <div className="flex mt-8">
      <div className="w-full min-h-screen mt-20 bg-black text-white flex flex-col md:flex-row gap-6 md:px-9 px-5">
        {/* FILTER SECTION */}
        <div className="w-full md:w-fit">
          {/* Mobile Title and Filter */}
          <div className="md:hidden flex-1 flex justify-between text-center items-center mt-8 mb-6 space-y-4 w-full">
            <h1 className="text-3xl font-bold text-center m-0">
              Ивэнт холл хайх
            </h1>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center gap-2 bg-white px-6 text-black hover:bg-neutral-200 py-2">
                  <Filter size={16} /> Шүүлтүүр
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-80 max-w-[90vw] bg-neutral-900 text-white border border-neutral-800 p-4 rounded-lg shadow-lg flex flex-col max-h-[80vh] overflow-y-auto mx-auto z-100">
                <EventHallsPage
                  originalData={originalHalls}
                  onFilterChange={setFilteredHalls}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Desktop Filter */}
          <div className="hidden md:block sticky top-10 max-h-[calc(100vh-6rem)]">
            <EventHallsPage
              originalData={originalHalls}
              onFilterChange={setFilteredHalls}
            />
          </div>
        </div>

        {/* EVENT HALLS LIST */}
        <div className="flex flex-wrap justify-center mt-[-16] gap-5 flex-1">
          {/* SKELETONS */}
          {loading && <EventHallsSkeleton />}

          {/* EVENT HALL CARDS */}
          {!loading &&
            filteredHalls.map((hall) => (
              <div
                key={hall.id}
                className="w-[40%] flex-1 min-w-[280px] max-w-[400px]
                           bg-neutral-900 rounded-2xl overflow-hidden shadow-xl 
                           hover:scale-[1.02] transition-transform duration-200 
                           flex flex-col"
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

          {/* EMPTY STATE */}
          {!loading && filteredHalls.length === 0 && (
            <div className="text-neutral-400 text-center mt-5 w-full">
              No event halls found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
