import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { performerId, hallId, starttime } = await req.json();

    if (!performerId || !hallId) {
      return NextResponse.json(
        { success: false, message: "performerId болон hallId шаардлагатай." },
        { status: 400 }
      );
    }

    // ---- TOKEN SHALGANA ----
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token байхгүй байна." },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    // ---- USER ИЙН EMAIL + NAME АВСАН ----
    const user = await prisma.mruser.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Хэрэглэгч олдсонгүй" },
        { status: 404 }
      );
    }

    // ---- DAWHAR PERFORMER BOOKING SHALGANA ----
    const exists = await prisma.booking.findFirst({
      where: {
        userid: userId,
        performersid: performerId,
      },
      include: {
        performers: true,
      },
    });

    if (exists) {
      // EMAIL: Already booked notify
      await sendEmail({
        email: user.email,
        name: user.name,
        content: `Та ${exists.performers?.name}-г аль хэдийн захиалсан байна.`,
      });

      return NextResponse.json({
        success: false,
        message: "Та энэ уран бүтээлчийг аль хэдийн захиалсан байна.",
      });
    }

    // ---- NEW BOOKING ----
    const booking = await prisma.booking.create({
      data: {
        userid: userId,
        performersid: performerId,
        hallid: hallId,
        date: new Date(),
        starttime,
        status: "pending",
      },
      include: {
        performers: true, // Performer info
        event_halls: true, // Hall info
        User: true, // Хэрэглэгч info
      },
    });

    const performerEmailContent = `
<p>Сайн байна уу, ${booking.performers?.name}?</p>
<p>Хэрэглэгч <strong>${
      booking.User.name
    }</strong> танай Event Hall-д захиалга хүсэлт илгээсэн байна:</p>
<ul>
  <li>Event Hall: ${booking.event_halls?.name}</li>
  <li>Огноо: ${new Date(booking.date).toLocaleDateString()}</li>
  <li>Эхлэх цаг: ${booking.starttime || "Тодорхойгүй"}</li>
</ul>

<p>Захиалга баталгаажуулахын тулд доорх товч дээр дарна уу:</p>
<p>
<a href="${process.env.NEXT_PUBLIC_BASE_URL}/booking-response?bookingId=${
      booking.id
    }&action=approve" style="padding:10px 20px; background-color:green; color:white; text-decoration:none; border-radius:5px; margin-left:10px;">Approve</a>



  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/booking-response?bookingId=${
      booking.id
    }&action=decline" style="padding:10px 20px; background-color:red; color:white; text-decoration:none; border-radius:5px; margin-left:10px;">Decline</a>
</p>
`;

    // EMAIL: Success notify
    await sendEmail({
      email: booking.performers?.contact_email, // Performer-ийн email
      name: booking.performers?.name,
      content: performerEmailContent,
    });

    return NextResponse.json({
      success: true,
      message: "Уран бүтээлч амжилттай захиалагдлаа!",
      booking,
    });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { success: false, message: "Алдаа гарлаа", error: error.message },
      { status: 500 }
    );
  }
}

async function sendEmail({ email, name, content }: any) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Event Hall" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Танд шинэ захиалга ирлээ web orj shalganu",
    html: content,
  });
}
