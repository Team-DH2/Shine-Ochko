"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [performerBookings, setPerformerBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Dashboard харахын тулд эхлээд нэвтэрнэ үү.");
      router.push("/login");
      return;
    }

    fetch("/api/dashboard-backend", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setPerformerBookings(data.performerBookings || []);
      })
      .catch((err) => console.error(err));
  }, [router]);
  console.log({ bookings });
  const DeleteBooking = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Нэвтэрнэ үү");

    try {
      const res = await fetch("/api/reset-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to delete");

      alert(data.message);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Серверийн алдаа");
    }
  };

  if (!bookings.length)
    return <p className="text-white text-4xl">Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {bookings.map((b) => {
        const relatedPerformers = performerBookings.filter(
          (pb) => pb.hallid === b.hallid && pb.starttime === b.starttime
        );
        console.log({ relatedPerformers });
        console.log({ bookings });

        return (
          <Card key={b.id} className="bg-white text-black p-4 rounded-xl">
            <h3 className="font-semibold">{b.event_halls?.name}</h3>
            <p>Өдөр: {new Date(b.date).toLocaleDateString()}</p>
            <p>Эхлэх цаг: {b.starttime}</p>
            <p>Статус: {b.status}</p>
            <Button onClick={() => DeleteBooking(b.id)}>Цуцлах</Button>

            {relatedPerformers.length > 0 && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <h4 className="font-medium mb-1">Уран бүтээлчид:</h4>
                {relatedPerformers.map((pb) => (
                  <div
                    key={pb.id}
                    className="flex justify-between px-2 py-1 mb-1 bg-gray-200 rounded"
                  >
                    <span>{pb.performers?.name}</span>
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
            )}
          </Card>
        );
      })}
    </div>
  );
}
