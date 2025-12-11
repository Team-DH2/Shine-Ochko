"use client";
import { useState } from "react";
import { MapPin, Star, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventHallsPage from "./EventHallFilter";
import { useRouter } from "next/navigation";
import EventHallsSkeleton from "@/components/us/EventHallSkeleton";
import useSWR from "swr";
import { publicFetcherEventHalls } from "@/lib/fetcherpublic";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import ImageWithFallback from "@/components/us/Fallback";

export default function EventHalls() {
  const router = useRouter();

  // --- SWR fetch ---
  const { data, isLoading } = useSWR(
    "/api/event-halls",
    publicFetcherEventHalls
  );

  // Шүүлтүүр state
  const [filteredHalls, setFilteredHalls] = useState<any[]>([]);

  // data ирсний дараа анхдагч filter set хийх
  const halls = data || [];

  return (
    <div className="flex mt-8">
      <div className="w-full min-h-screen mt-20 bg-black text-white flex flex-col md:flex-row gap-6 md:px-9 px-5">
        {/* FILTER SECTION */}
        <div className="w-full md:w-fit">
          {/* MOBILE FILTER */}
          <div className="md:hidden flex justify-between items-center mt-8 mb-6 w-full">
            <h1 className="text-3xl font-bold">Ивэнт холл хайх</h1>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center gap-2 bg-white px-6 text-black hover:bg-neutral-200 py-2">
                  <Filter size={16} /> Шүүлтүүр
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-80 max-w-[90vw] bg-neutral-900 text-white border border-neutral-800 p-4 rounded-lg shadow-lg flex flex-col max-h-[80vh] overflow-y-auto mx-auto z-100">
                <EventHallsPage
                  originalData={halls}
                  onFilterChange={setFilteredHalls}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* DESKTOP FILTER */}
          <div>
            <EventHallsPage
              originalData={halls}
              onFilterChange={setFilteredHalls}
            />
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="flex flex-wrap justify-center gap-5 flex-1">
          {/* SKELETON LOADING */}
          {isLoading && <EventHallsSkeleton />}

          {/* Хэрэв isLoading false → шүүлтүүртэй дата ашиглах */}
          {!isLoading &&
            (filteredHalls.length > 0 ? filteredHalls : halls).map(
              (hall: any) => (
                <div
                  key={hall.id}
                  className="w-[40%] flex-1 min-w-[280px] max-w-[400px]
                           bg-neutral-900 rounded-2xl overflow-hidden shadow-xl 
                           hover:scale-[1.02] transition-transform duration-200 flex flex-col"
                >
                  <div className="relative w-full h-56">
                    <ImageWithFallback
                      src={hall.images[0]}
                      fallbackSrc="/eventhalldefault.jpg"
                      alt={hall.name}
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    <h2 className="text-xl font-semibold">{hall.name}</h2>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={18} />
                        <p className="truncate w-[90%]">{hall.location}</p>
                      </div>

                      <div className="flex items-center gap-2 text-yellow-400">
                        <Star size={18} />
                        <p>{hall.rating}</p>
                      </div>
                    </div>

                    <div className="flex justify-between text-gray-400 items-center h-10">
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
              )
            )}

          {/* EMPTY STATE */}
          {!isLoading && filteredHalls.length === 0 && (
            <div className="text-neutral-400 text-center mt-10 w-full text-lg">
              Илэрц олдсонгүй.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
