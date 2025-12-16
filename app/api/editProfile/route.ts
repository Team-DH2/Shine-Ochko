/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/* ================= TOKEN HELPER ================= */
function getUserId(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: number;
  };

  if (!decoded?.id) throw new Error("Invalid token");
  return decoded.id;
}

/* ================= PATCH: NAME UPDATE ================= */
export async function PATCH(request: Request) {
  try {
    const userId = getUserId(request);

    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.length < 2) {
      return NextResponse.json(
        { error: "Нэр хамгийн багадаа 2 тэмдэгт байна" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.mruser.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Profile шинэчлэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

/* ================= POST: AVATAR UPLOAD (DB-гүй) ================= */
export async function POST(request: Request) {
  try {
    // 🔐 auth шалгана (хэрвээ хэрэггүй бол авч болно)
    getUserId(request);

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл олдсонгүй" }, { status: 400 });
    }

    // uploads folder байхгүй бол үүсгэнэ
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(uploadDir, fileName);

    await writeFile(uploadPath, buffer);

    // ❗ DB update ХИЙХГҮЙ
    return NextResponse.json({
      avatar: `/uploads/${fileName}`,
    });
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Зураг upload хийхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
