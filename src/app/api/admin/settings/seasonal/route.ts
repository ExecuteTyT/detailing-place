import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { seasonalOffer } from "@/lib/db/schema";

export async function GET() {
  try {
    const row = db
      .select()
      .from(seasonalOffer)
      .where(eq(seasonalOffer.isActive, true))
      .get();

    return NextResponse.json(row ?? null);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch seasonal offer" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      discount,
      promoCode,
      endDate,
      isActive,
    } = body as {
      title: string;
      description: string;
      discount: number;
      promoCode?: string;
      endDate: string;
      isActive: boolean;
    };

    if (!title || !description || discount == null || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    db.transaction((tx) => {
      tx.delete(seasonalOffer)
        .where(eq(seasonalOffer.isActive, true))
        .run();
      tx.insert(seasonalOffer)
        .values({
          title,
          description,
          discount,
          promoCode: promoCode ?? null,
          endDate,
          isActive: isActive ?? true,
        })
        .run();
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update seasonal offer" },
      { status: 500 }
    );
  }
}
