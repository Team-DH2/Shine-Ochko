import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const hallId = req.nextUrl.searchParams.get("hallId");
    const dateParam = req.nextUrl.searchParams.get("date");

    if (!hallId || !dateParam) {
      return NextResponse.json(
        { message: "hallId and date are required" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);

    // 1️⃣ Hall base price
    const hall = await prisma.event_halls.findUnique({
      where: { id: Number(hallId) },
      select: { price: true },
    });

    if (!hall) {
      return NextResponse.json({ message: "Hall not found" }, { status: 404 });
    }

    // 2️⃣ Тухайн өдрийн booking-ууд
    const bookings = await prisma.booking.findMany({
      where: {
        hallid: Number(hallId),
        date,
      },
      select: {
        starttime: true,
        endtime: true,
        override_price: true,
      },
    });

    // 3️⃣ Time slot definition
    const slots = {
      am: { start: "09:00", end: "12:00", base: hall.price?.[0] ?? 0 },
      pm: {
        start: "13:00",
        end: "17:00",
        base: hall.price?.[1] ?? hall.price?.[0] ?? 0,
      },
      udur: {
        start: "09:00",
        end: "22:00",
        base: hall.price?.[2] ?? hall.price?.[0] ?? 0,
      },
    };

    // 4️⃣ Final price calculation
    const result: Record<string, number> = {};

    for (const key of Object.keys(slots)) {
      const slot = slots[key as keyof typeof slots];

      const booking = bookings.find(
        (b) => b.starttime === slot.start && b.endtime === slot.end
      );

      result[key] = booking?.override_price ?? slot.base;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
