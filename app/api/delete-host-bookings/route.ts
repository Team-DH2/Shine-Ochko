import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    const result = await prisma.booking.deleteMany({
      where: {
        hostid: {
          not: null,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} host bookings`,
      count: result.count,
    });
  } catch (error: any) {
    console.error("Error deleting host bookings:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
