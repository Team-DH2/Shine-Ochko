"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [performerBookings, setPerformerBookings] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings));
  }, []);
  useEffect(() => {
    fetch("/api/performer-bookings")
      .then((res) => res.json())
      .then((data) => setPerformerBookings(data.performerBookings || []));
  }, []);

  console.log({ bookings });
  const DeleteBooking = async (id: string | number) => {
    try {
      const response = await fetch("/api/reset-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      console.log({ data });

      if (!response.ok) {
        console.error("Failed to delete booking:", data.error);
        alert("Failed to delete booking: " + data.error);
        return;
      }

      console.log(data.message);
      alert(data.message);
      setBookings((prev) => prev.filter((booking: any) => booking.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking");
    }
  };
  return (
    <div className="p-6 bg-[#0d0f16] text-white min-h-screen space-y-10">
      {/* Dashboard Overview */}
      <Card className="bg-[#1a1d29] border border-[#2a2e3d] shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#11131b] border border-[#2a2e3d] rounded-2xl p-4">
            <p className="text-sm text-gray-400">Total Upcoming Events</p>
            <h3 className="text-3xl font-bold text-blue-400">
              {bookings.length}
            </h3>
          </Card>
          <Card className="bg-[#11131b] border border-[#2a2e3d] rounded-2xl p-4">
            <p className="text-sm text-gray-400">Pending Requests</p>
            <h3 className="text-3xl font-bold text-yellow-400"></h3>
          </Card>
          <Card className="bg-[#11131b] border border-[#2a2e3d] rounded-2xl p-4">
            <p className="text-sm text-gray-400">Total Booked Revenue</p>
            <h3 className="text-3xl font-bold text-blue-300"></h3>
          </Card>
          {/* <Button>Tulbur Tuluh</Button> */}
        </div>
      </Card>

      {/* Upcoming Events */}
      <div className="flex">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookings.map((b: any) => (
              <div
                key={b.id}
                className="rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200"
              >
                {/* IMAGE */}
                <img
                  src={b.event_halls?.images?.[0] ?? "/placeholder.jpg"}
                  alt="hall"
                  className="h-48 w-full object-cover"
                />

                {/* CONTENT */}
                <div className="p-4 space-y-3">
                  <h2 className="text-xl font-semibold text-black">
                    {b.event_halls?.name ?? "Event Hall"}
                  </h2>

                  {/* DATE & TIME */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Өдөр:</span>
                      {new Date(b.date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Эхлэх цаг:</span>{" "}
                      {b.starttime}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-700 text-sm">{b.event_description}</p>

                  {/* STATUS BADGE */}
                  <div>
                    <span
                      className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${
                      b.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* LOCATION */}
                  <p className="text-gray-500 text-sm">
                    📍 {b.event_halls?.location}
                  </p>
                  <Button onClick={() => DeleteBooking(b.id)}>
                    Zahialaga tsutslah
                  </Button>
                </div>
                {/* Performer Bookings */}
                <div className="mt-3 space-y-2">
                  {performerBookings
                    .filter((pb) => pb.hallId === b.id) // тухайн hall-д харгалзах performer
                    .map((pb) => (
                      <div
                        key={pb.id}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                      >
                        <span className="font-medium">{pb.performer.name}</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            pb.status === "pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : pb.status === "approved"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {pb.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <Button onClick={() => router.push("/performer")}>
              Performer Zahialah
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
