import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { partnerBrands } from "@/lib/db/schema";

export async function GET() {
  try {
    const rows = db
      .select()
      .from(partnerBrands)
      .orderBy(asc(partnerBrands.sortOrder))
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch brands" },
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
        name: string;
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
      tx.delete(partnerBrands).run();
      if (items.length > 0) {
        tx.insert(partnerBrands)
          .values(
            items.map((item) => ({
              name: item.name,
              sortOrder: item.sortOrder,
            }))
          )
          .run();
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update brands" },
      { status: 500 }
    );
  }
}
