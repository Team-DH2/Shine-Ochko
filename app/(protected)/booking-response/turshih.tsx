"use client";

import React, { useEffect, useState } from "react";

interface Booking {
  id: number;
  status: "approved" | "cancelled";
  event_halls: { name: string };
  User: { name: string };
  performers: { name: string };
}

interface BookingResponsePageProps {
  bookingId: string;
  action?: string;
}

export default function BookingResponsePage({
  bookingId,
  action,
}: BookingResponsePageProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "Захиалгын статус өөрчлөгдөж байна..."
  );

  useEffect(() => {
    if (bookingId && (action === "approve" || action === "decline")) {
      handleBookingResponse(Number(bookingId), action as "approve" | "decline");
    } else {
      setLoading(false);
      setMessage("Буруу query параметр байна");
    }
  }, [bookingId, action]);

  const handleBookingResponse = async (
    bookingId: number,
    action: "approve" | "decline"
  ) => {
    try {
      const res = await fetch(
        `/api/booking-response?bookingId=${bookingId}&action=${action}`
      );
      const data = await res.json();

      if (data.success && data.booking) {
        setBooking(data.booking);
        setMessage(
          data.booking.status === "cancelled"
            ? "Захиалга татгалзсан байна!"
            : "Захиалга амжилттай баталгаажлаа!"
        );
      } else {
        setMessage(data.message || "Алдаа гарлаа");
      }
    } catch (error) {
      console.error(error);
      setMessage("Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-white">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-[70px] p-6 bg-gray-800 text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Захиалгын мэдээлэл</h1>
      <div
        className={`p-4 rounded-lg ${
          booking?.status === "cancelled" ? "bg-red-600" : "bg-green-600"
        }`}
      >
        <p className="font-semibold mb-2">{message}</p>
        {booking && (
          <div className="mt-2 text-sm">
            <p>Event Hall: {booking.event_halls.name}</p>
            <p>Хэрэглэгч: {booking.User.name}</p>
            <p>Performer: {booking.performers.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
