import prisma from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/uploadimage";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const eventHalls = await prisma.event_halls.findMany({
      orderBy: { id: "asc" },
    });
    console.log("--- eventHalls ---", eventHalls);
    return NextResponse.json({ data: eventHalls });
  } catch (error) {
    console.error("Error fetching event halls:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch event halls",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, hallName, location, phoneNumber, email, images } = body;

    // Cloudinary-д upload хийх
    const uploadedImages: string[] = [];
    for (const img of images) {
      const url = await uploadImageToCloudinary(img);
      uploadedImages.push(url);
    }

    //  Prisma-д хадгалах
    const form = await prisma.form.create({
      data: {
        name: name,
        hallname: hallName,
        location: location,
        number: phoneNumber,
        email: email,
        images: uploadedImages,
      },
    });

    return NextResponse.json({
      message: "Амжилттай хадгалагдлаа",
      form,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
