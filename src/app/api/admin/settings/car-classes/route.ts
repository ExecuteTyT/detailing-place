import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { carClasses } from "@/lib/db/schema";

export async function GET() {
  try {
    const rows = db
      .select()
      .from(carClasses)
      .orderBy(asc(carClasses.sortOrder))
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch car classes" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as {
      items: Array<{
        id: number;
        label: string;
        example: string;
        sortOrder: number;
      }>;
    };

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    db.transaction((tx) => {
      for (const item of items) {
        tx.update(carClasses)
          .set({
            label: item.label,
            example: item.example,
            sortOrder: item.sortOrder,
          })
          .where(eq(carClasses.id, item.id))
          .run();
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update car classes" },
      { status: 500 }
    );
  }
}
