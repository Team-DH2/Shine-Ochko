import prisma from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/uploadimage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, hallName, location, number, email, images } = body;

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
        number: number,
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
