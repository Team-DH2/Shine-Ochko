/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaMapMarkerAlt, FaPhone, FaParking } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineRestaurantMenu } from "react-icons/md";

import { CarouselMy } from "@/components/us/CarouselMy";
import BookingCalendar from "@/components/event-halls/DayCalendar";
import { LayoutFooter } from "@/components/us/LayoutFooter";

interface EventHall {
  rating: number;
  id: number;
  name: string;
  location?: string | null;
  capacity?: string | null;
  description?: string | null;
  suitable_events: string[];
  images: string[];
  phonenumber?: string | null;
  menu: string[];
  parking_capacity?: number | null;
  additional_informations: string[];
  informations_about_hall: string[];
  advantages: string[];
  localtion_link?: string;
}

export default function SelectedEventHall() {
  const params = useParams();
  const eventHallId = params.id as string;

  const [eventHallData, setEventHallData] = useState<EventHall | null>(null);

  const getSelectedEventHall = useCallback(async () => {
    if (!eventHallId) return;
    try {
      const res = await fetch(`/api/selected-event-hall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventHallId }),
      });
      const data = await res.json();
      setEventHallData(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching event hall:", error);
    }
  }, [eventHallId]);

  useEffect(() => {
    getSelectedEventHall();
  }, [getSelectedEventHall]);

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Carousel Section */}
      {eventHallData && eventHallData.images.length > 0 && (
        <section className="h-screen snap-start">
          <CarouselMy
            halls={[
              {
                id: eventHallData.id,
                name: eventHallData.name,
                title: eventHallData.name,
                description: eventHallData.description || "",
                duureg: "",
                rating: eventHallData.rating || 0,
                images: eventHallData.images,
              },
            ]}
          />
        </section>
      )}

      {/* Basic Info Section */}
      <section className="min-h-screen snap-start bg-black flex items-center justify-center flex-col py-12">
        <div className="max-w-6xl w-full px-6 space-y-6 text-white">
          {/* Location & Contact Info */}
          <div className="bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex gap-5 items-center">
                <FaMapMarkerAlt size={24} className="text-blue-600" />
                <span>{eventHallData?.location}</span>
                {eventHallData?.localtion_link && (
                  <a
                    href={eventHallData.localtion_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 underline transition-colors"
                  >
                    Show on map
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-10 mt-2">
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
                  <strong>Утас:</strong> {eventHallData?.phonenumber}
                </div>
                <div className="flex items-center gap-2">
                  <FaPeopleGroup size={24} className="text-blue-600" />
                  <strong>Хүчин чадал:</strong> {eventHallData?.capacity}
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineRestaurantMenu
                    size={24}
                    className="text-blue-600"
                  />
                  <strong>Меню:</strong> {eventHallData?.menu.join(", ")}
                </div>
                <div className="flex items-center gap-2">
                  <FaParking size={24} className="text-blue-600" />
                  <strong>Машины зогсоол:</strong>{" "}
                  {eventHallData?.parking_capacity}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Advantages */}
          <div className="bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors">
            <p className="text-gray-200">{eventHallData?.description}</p>
            <ul className="pl-6 space-y-2 mt-4">
              {eventHallData?.advantages?.map((adv, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <IoMdCheckmarkCircleOutline
                    className="text-blue-600 shrink-0"
                    size={20}
                  />
                  <span className="text-gray-200">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Three Column Info Section */}
        <div className="max-w-6xl w-full px-6 mt-6 flex flex-col lg:flex-row gap-6 text-white">
          {/* Additional Info */}
          <div className="flex-1 bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-4">
              Нэмэлт мэдээлэл
            </h3>
            <ul className="space-y-2">
              {eventHallData?.additional_informations?.map((info, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <IoMdCheckmarkCircleOutline
                    className="text-blue-600 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-gray-200">{info}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suitable Events */}
          <div className="flex-1 bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-4">
              Тохиромжтой хүлээн авалтууд
            </h3>
            <ul className="space-y-2">
              {eventHallData?.suitable_events?.map((event, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <IoMdCheckmarkCircleOutline
                    className="text-blue-600 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-gray-200">{event}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hall Info */}
          <div className="flex-1 bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-4">
              Танхимын мэдээлэл
            </h3>
            <ul className="space-y-2">
              {eventHallData?.informations_about_hall?.map((info, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <IoMdCheckmarkCircleOutline
                    className="text-blue-600 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-gray-200">{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="min-h-screen snap-start flex items-center justify-center bg-black py-12">
        <div className="w-full max-w-7xl px-6 mt-3">
          <BookingCalendar hallId={eventHallId} />
        </div>
      </section>
      <LayoutFooter />
    </div>
  );
}
