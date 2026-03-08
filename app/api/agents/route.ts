import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const agents = await prisma.agents.findMany();
    return NextResponse.json(agents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentId, hallId, starttime, bookeddate } = body;

    // Get user ID from token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Token байхгүй байна" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      const jwt = require("jsonwebtoken");
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Token буруу эсвэл хүчингүй" },
        { status: 403 }
      );
    }

    const userId = decoded.id;

    // Check if this agent is already booked for this event hall, date, and time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        agentid: agentId,
        hallid: hallId,
        date: new Date(bookeddate),
        starttime: starttime,
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "Энэ Event Hall дээр энэ агент тухайн өдөр аль хэдийн захиалагдсан байна.",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        agentid: agentId,
        userid: userId,
        hallid: hallId,
        date: new Date(bookeddate),
        starttime: starttime,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("Agent booking error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
