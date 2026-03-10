import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { trustBadges } from "@/lib/db/schema";

export async function GET() {
  try {
    const rows = db
      .select()
      .from(trustBadges)
      .orderBy(asc(trustBadges.sortOrder))
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch trust badges" },
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
        iconName: string;
        title: string;
        description: string;
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
      tx.delete(trustBadges).run();
      if (items.length > 0) {
        tx.insert(trustBadges)
          .values(
            items.map((item) => ({
              iconName: item.iconName,
              title: item.title,
              description: item.description,
              sortOrder: item.sortOrder,
            }))
          )
          .run();
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update trust badges" },
      { status: 500 }
    );
  }
}
