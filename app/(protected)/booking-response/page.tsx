"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Booking {
  id: number;
  status: string;
  event_halls: { name: string };
  User: { name: string };
  performers: { name: string };
}

const BookingResponsePage = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const action = searchParams.get("action"); // approve эсвэл decline

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "Захиалгын статус өөрчлөгдөж байна..."
  );

  useEffect(() => {
    if (bookingId && (action === "approve" || action === "decline")) {
      handleBookingResponse(Number(bookingId), action);
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

      if (data.success) {
        setBooking(data.booking);
        setLoading(false);
        if (data.booking.status === "cancelled") {
          setMessage("Захиалга татгалзсан байна!");
        } else {
          setMessage("Захиалга амжилттай баталгаажлаа!");
        }
      } else {
        setMessage(data.message || "Алдаа гарлаа");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Серверийн алдаа гарлаа");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-white">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-70 p-6 bg-gray-800 text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Захиалгын мэдээлэл</h1>
      <div
        className={`p-4 rounded-lg ${
          booking?.status === "cancelled" ? "bg-red-600" : "bg-green-600"
        }`}
      >
        <p className="font-semibold mb-2">{message}</p>
        {booking?.status === "cancelled" && (
          <div className="mt-2 text-sm">
            <p>Event Hall: {booking.event_halls.name}</p>
            <p>Хэрэглэгч: {booking.User.name}</p>
            <p>Performer: {booking.performers.name}</p>
          </div>
        )}
        {booking?.status === "approved" && (
          <div className="mt-2 text-sm">
            <p>Event Hall: {booking.event_halls.name}</p>
            <p>Хэрэглэгч: {booking.User.name}</p>
            <p>Performer: {booking.performers.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingResponsePage;
