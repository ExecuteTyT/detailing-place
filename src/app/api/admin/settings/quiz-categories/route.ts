import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { quizCategories } from "@/lib/db/schema";

export async function GET() {
  try {
    const rows = db
      .select()
      .from(quizCategories)
      .orderBy(asc(quizCategories.sortOrder))
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quiz categories" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as {
      items: Array<{
        id?: number;
        label: string;
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
      tx.delete(quizCategories).run();
      if (items.length > 0) {
        tx.insert(quizCategories)
          .values(
            items.map((item) => ({
              label: item.label,
              sortOrder: item.sortOrder,
            }))
          )
          .run();
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update quiz categories" },
      { status: 500 }
    );
  }
}
