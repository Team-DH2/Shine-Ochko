"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings));
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
              </div>
            ))}
          </div>
          <div>
            <Button onClick={() => router.push("/performer")}>
              Performer Zahialah
            </Button>
          </div>

          {/* Booking Requests */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <Card className="bg-[#1a1d29] border border-[#2a2e3d] rounded-2xl p-5">
                <h3 className="text-lg font-semibold">Sarah Miller</h3>
                <p className="text-gray-300 text-sm">
                  Wedding Reception – January 20, 2025
                </p>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-400"
                  >
                    Review
                  </Button>
                  <Button className="bg-blue-600">Approve</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div>
          {/* Right Side Panel (Calendar + Recent Activities) */}
          <div className="flex flex-col gap-10">
            {/* Calendar */}
            {/* <Card className="bg-[#1a1d29] border border-[#2a2e3d] rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-3">November 2025</h2>
              <div className="grid grid-cols-7 text-center text-gray-400 text-sm gap-2">
                {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((d) => (
                  <div key={d}>{d}</div>
                ))}
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg ${
                      i + 1 === 19 ? "bg-blue-600 text-white" : "bg-[#11131b]"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </Card> */}

            {/* Recent Activities */}
            <Card className="bg-[#1a1d29] border border-[#2a2e3d] rounded-2xl p-5 xl:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li>Sarah Miller sent a new booking request – 2 hours ago</li>
                <li>Annual Corporate Gala booking confirmed – 1 day ago</li>
                <li>Reminder: Product Launch Event next week – 3 days ago</li>
                <li>New message from venue manager – 5 days ago</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
