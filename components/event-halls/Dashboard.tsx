"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
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
      })
      .catch((err) => console.error(err));
  }, [router]);

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

  // ---- Hall бүрээр group хийх ----
  const groupedBookings = bookings.reduce((acc: any, curr: any) => {
    const key = `${curr.hallid}-${curr.starttime}`;
    if (!acc[key])
      acc[key] = { hall: curr.event_halls, hallBooking: null, performers: [] };

    if (!curr.performersid) {
      acc[key].hallBooking = curr; // Hall booking
    } else {
      acc[key].performers.push(curr); // Performer booking
    }

    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Object.values(groupedBookings).map((group: any) => {
        const hallBooking = group.hallBooking;
        const performers = group.performers;

        return (
          <Card
            key={hallBooking?.id || performers[0]?.id}
            className="bg-white text-black p-4 rounded-xl"
          >
            <h3 className="font-semibold">{group.hall?.name}</h3>
            {hallBooking && (
              <>
                <p>Өдөр: {new Date(hallBooking.date).toLocaleDateString()}</p>
                <p>Эхлэх цаг: {hallBooking.starttime}</p>
                <p>Статус: {hallBooking.status}</p>
                <Button onClick={() => DeleteBooking(hallBooking.id)}>
                  Цуцлах
                </Button>
              </>
            )}

            {performers.length > 0 && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <h4 className="font-medium mb-1">Уран бүтээлчид:</h4>
                {performers.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex justify-between px-2 py-1 mb-1 bg-gray-200 rounded"
                  >
                    <span>{p.performers?.name}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        p.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : p.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {p.status}
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
