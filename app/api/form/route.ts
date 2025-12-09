import prisma from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/uploadimage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      hallName,
      location,
      phoneNumber,
      email,
      images = [],
      suitableEvents,
      price,
      rating,
      menu,
      locationLink,
      parkingCapacity,
      description,
      additional,
      aboutHall,
      advantages,
      booking,
      capacity,
    } = body;

    const uploadedImages: string[] = [];
    for (const img of images) {
      const url = await uploadImageToCloudinary(img);
      uploadedImages.push(url);
    }

    const parsedCapacity = capacity ? Number(capacity) : null;
    const parsedRating = rating ? Number(rating) : null;

    const parsedPrice = price ? Number(price) : null;

    const parsedParkingCapacity = parkingCapacity
      ? Number(parkingCapacity)
      : null;

    const form = await prisma.form.create({
      data: {
        name,
        hallname: hallName,
        location,
        number: phoneNumber,
        email,
        images: uploadedImages,
        suitableEvents,
        price: parsedPrice,
        rating: parsedRating,
        menu,
        locationlink: locationLink,
        parkingcapacity: parsedParkingCapacity,
        additional,
        abouthall: aboutHall,
        advantages,
        booking,
        capacity: parsedCapacity,
        description,
      },
    });

    return NextResponse.json({
      message: "Амжилттай бүртгэгдлээ",
      form,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Алдаа гарлаа", details: String(error) },
      { status: 500 }
    );
  }
}
