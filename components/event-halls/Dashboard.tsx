"use client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import useSWR from "swr";
import Image from "next/image";
import HallCarousel from "./Hallcarousel";
import { authFetcher } from "@/lib/fetcher";

export default function Dashboard() {
  const router = useRouter();
  const {
    data: bookings,
    isLoading,
    mutate,
  } = useSWR("/api/dashboard-backend", authFetcher);
  console.log({ bookings });
  if (isLoading) return <p className="text-white text-4xl">Loading...</p>;
  if (!bookings) return <p className="text-white">No data</p>;

  const DeleteBooking = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Нэвтэрнэ үү");

    mutate((prev: any[]) => prev.filter((b) => b.id !== id), false);

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
      if (!res.ok) {
        alert(data.error || "Failed to delete");
        mutate();
        return;
      }

      alert(data.message);
      mutate();
    } catch {
      alert("Серверийн алдаа");
      mutate();
    }
  };

  console.log({ bookings });
  if (bookings.length === 0) {
    return (
      <div>
        <h1 className="text-2xl text-white font-bold mb-5">
          Таны захиалсан Event hall
        </h1>
        <p className="text-white text-4xl">Таны захиалга хоосон байна.</p>
      </div>
    );
  }
  // ---- Group bookings ----
  const groupedBookings = bookings.reduce((acc: any, curr: any) => {
    const key = `${curr.hallid}-${curr.starttime}-${curr.date}`; // 👉 DATE нэмж өглөө!

    if (!acc[key]) {
      acc[key] = {
        hall: curr.event_halls,
        hallBooking: null,
        performers: [],
      };
    }

    if (!curr.performersid) acc[key].hallBooking = curr;
    else acc[key].performers.push(curr);

    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Object.entries(groupedBookings).map(([key, group]: any) => {
        const hallBooking = group.hallBooking;
        const performers = group.performers;
        console.log({ groupedBookings });

        return (
          <Card
            key={hallBooking?.id || performers[0]?.id}
            className="bg-white text-black p-2 rounded-xl space-y-1"
          >
            {/* Hall Info */}
            <h3 className="font-semibold text-lg">{group.hall?.name}</h3>

            {/* Hall Carousel */}
            {group.hall?.images?.length > 0 && (
              <HallCarousel images={group.hall.images} />
            )}
            <p className="text-gray-600 h-10 ">
              <span className="text-black font-bold ">Хаяг : </span>
              {group.hall?.location}
            </p>
            <p className="text-gray-600">
              <span className="text-black font-bold">Холбогдох Утас : </span>
              {group.hall?.phonenumber}
            </p>
            <p className="text-gray-600">
              <span className="text-black font-bold">Өдөр: </span>
              {hallBooking
                ? new Date(hallBooking.date).toLocaleDateString()
                : performers[0]?.date
                ? new Date(performers[0].date).toLocaleDateString()
                : "-"}
            </p>
            <p className="text-gray-600">
              <span className="text-black font-bold">Эхлэх цаг: </span>
              {hallBooking?.starttime || performers[0]?.starttime || "-"}
            </p>

            {/* Performers */}
            {performers.length > 0 && (
              <div className="p-3 border rounded-xl bg-gray-100 space-y-4">
                <h4 className="font-semibold">🎤 Таны урьсан уран бүтээлчид</h4>
                {performers.map((p: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {p.performers?.image ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                          <Image
                            src={p.performers.image}
                            alt={p.performers.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                          No Image
                        </div>
                      )}

                      <div>
                        <p className="font-semibold">{p.performers?.name}</p>
                        <p className="text-sm text-gray-600">
                          {p.performers?.genre}
                        </p>
                      </div>
                    </div>

                    <Button
                      disabled
                      className={`text-black ${
                        p.status === "approved"
                          ? "bg-green-300"
                          : "bg-yellow-500"
                      }`}
                    >
                      {p.status === "approved" ? "Approved" : "Pending"}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Booking Info */}
            {hallBooking && (
              <div className="space-y-2">
                <p>Өдөр: {new Date(hallBooking.date).toLocaleDateString()}</p>
                <p>Эхлэх цаг: {hallBooking.starttime}</p>
                <Button
                  className="text-white bg-black"
                  onClick={() => DeleteBooking(hallBooking.id)}
                >
                  Цуцлах
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
