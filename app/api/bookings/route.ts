// app/api/bookings/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const event_hall_id = searchParams.get("event_hall_id");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    // Query conditions
    const filters: any = {};

    if (event_hall_id) filters.hallid = Number(event_hall_id);
    if (status) filters.status = status;
    if (date) filters.date = new Date(date);

    const results = await prisma.booking.findMany({
      where: filters,
      include: {
        event_halls: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ bookings: results });
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { hallId, bookings } = await req.json();

    if (!hallId || !bookings || !Array.isArray(bookings)) {
      return NextResponse.json(
        { error: "Танхим болон bookings array шаардлагатай" },
        { status: 400 }
      );
    }

    const createdBookings = [];

    for (const b of bookings) {
      const { date, type } = b;
      if (!date || !type) continue;

      let starttime = "",
        endtime = "";
      if (type === "am") {
        starttime = "08:00";
        endtime = "14:00";
      } else if (type === "pm") {
        starttime = "18:00";
        endtime = "23:00";
      } else {
        starttime = "09:00";
        endtime = "24:00";
      }

      const booking = await prisma.booking.create({
        data: {
          userid: 1,
          hallid: Number(hallId),
          hostid: 1,
          ordereddate: new Date(),
          date: new Date(date),
          starttime,
          endtime,
          status: "pending",
        },
      });

      createdBookings.push(booking);
    }

    return NextResponse.json(
      {
        message: "Захиалгууд амжилттай хадгалагдлаа",
        bookings: createdBookings,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
