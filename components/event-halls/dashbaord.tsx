"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CalendarDays, DollarSign, Clock, MapPin } from "lucide-react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const router = useRouter();
  console.log("bookings", bookings);

  // Fetch bookings
  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings));
  }, []);

  // Delete Booking Function
  const DeleteBooking = async (id: string | number) => {
    try {
      const response = await fetch("/api/reset-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert("Failed to delete booking: " + data.error);
        return;
      }

      alert(data.message);
      setBookings((prev) => prev.filter((booking: any) => booking.id !== id));
    } catch (error) {
      alert("Error deleting booking");
    }
  };

  return (
    <div className="p-6 bg-[#0d0f16] text-white min-h-screen space-y-10">
      <Card className="bg-[#1a1d29] text-white border border-[#2a2e3d] rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Events */}
          <Card className="bg-gradient-to-br from-blue-700/20 to-blue-400/10 border border-blue-500/20 backdrop-blur-md p-5 rounded-2xl ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Upcoming Events</p>
                <h3 className="text-4xl font-bold text-blue-400 mt-1">
                  {bookings?.length}
                </h3>
              </div>
              <CalendarDays className="text-blue-400" size={40} />
            </div>
          </Card>

          {/* Pending Requests */}
          <Card className="bg-gradient-to-br from-blue-700/20 to-blue-400/10 border border-blue-500/20 backdrop-blur-md p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Pending Requests</p>
                <h3 className="text-4xl font-bold text-blue-400 mt-1">0</h3>
              </div>
              <Clock className="text-blue-400" size={40} />
            </div>
          </Card>

          {/* Revenue */}
          <Card className="bg-gradient-to-br from-blue-700/20 to-blue-400/10 border border-blue-500/20 backdrop-blur-md p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Revenue</p>
                <h3 className="text-4xl font-bold text-blue-400 mt-1">0</h3>
              </div>
              <DollarSign className="text-blue-400" size={40} />
            </div>
          </Card>
        </div>
      </Card>

      <div className="flex flex-col xl:flex-row gap-10">
        <div className="flex-1 space-y-10">
          {/* UPCOMING EVENTS */}

          <div>
            <h2 className="text-3xl/normal font-semibold mb-4">
              Upcoming Events
            </h2>

            <div className="grid xl:grid-cols-3 gap-6">
              {bookings?.map((b: any) => (
                <Card
                  key={b.id}
                  className="rounded-xl bg-[#161922] border border-[#2a2e3d] flex flex-col overflow-hidden"
                >
                  {/* IMAGE */}
                  <img
                    src={b.event_halls?.images?.[0] ?? "/placeholder.jpg"}
                    alt="hall"
                    className="h-60 w-full object-cover"
                    style={{ display: "block" }}
                  />

                  {/* CONTENT */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div className="space-y-2">
                      <h2 className="text-xl text-neutral-200 font-semibold">
                        {b.event_halls?.name ?? "Event Hall"}
                      </h2>

                      {/* DATE & TIME */}
                      <div className="flex justify-between text-sm text-gray-400">
                        <p>
                          <span className="font-medium text-gray-300">
                            Өдөр:
                          </span>
                          {new Date(b.date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium text-gray-300">
                            Эхлэх:
                          </span>
                          {b.starttime}
                        </p>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-gray-300 text-sm">
                        {b.event_description}
                      </p>

                      {/* STATUS */}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          b.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : b.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.status}
                      </span>

                      {/* LOCATION */}
                      <p className="text-gray-400 flex items-start gap-2 text-sm pt-3">
                        <MapPin size={16} />
                        <a>{b.event_halls?.location}</a>
                      </p>
                    </div>

                    {/* DELETE BUTTON */}
                    <Button
                      onClick={() => DeleteBooking(b.id)}
                      className="w-full bg-red-600 hover:bg-white hover:text-black transition-all duration-300 text-white mt-4"
                    >
                      Цуцлах
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              onClick={() => router.push("/performer")}
              className="mt-5 bg-blue-600 hover:bg-blue-700"
            >
              Performer захиалах
            </Button>
          </div>

          {/* BOOKING REQUESTS */}
          <div>
            <h2 className="text-3xl/normal  font-semibold mb-4">
              Booking Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card className="bg-[#1a1d29] border border-[#2a2e3d] rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all">
                <h3 className="text-lg font-semibold text-white">
                  Sarah Miller
                </h3>
                <p className="text-gray-300 text-sm">
                  Wedding Reception — January 20, 2025
                </p>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="border-blue-500 text-black"
                  >
                    Review
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Approve
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
