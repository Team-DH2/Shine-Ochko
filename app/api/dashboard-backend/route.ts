import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // 1. Hall booking-ууд
    const bookings = await prisma.booking.findMany({
      where: { userid: userId },
      include: {
        event_halls: true,
      },
      orderBy: { date: "asc" },
    });

    // 2. Performer booking-ууд
    const performerBookings = await prisma.booking.findMany({
      where: {
        userid: userId,
        performersid: { not: null }, // performer холбогдсон bookings
      },
      include: {
        performers: true,
      },
    });

    return NextResponse.json(
      {
        bookings,
        performerBookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
