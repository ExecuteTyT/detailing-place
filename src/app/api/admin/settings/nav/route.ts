import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { navItems } from "@/lib/db/schema";

export async function GET() {
  try {
    const rows = db
      .select()
      .from(navItems)
      .orderBy(asc(navItems.sortOrder))
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch nav items" },
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
        href: string;
        group: "service" | "info";
        isNew: boolean;
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
      tx.delete(navItems).run();
      if (items.length > 0) {
        tx.insert(navItems)
          .values(
            items.map((item) => ({
              label: item.label,
              href: item.href,
              group: item.group,
              isNew: item.isNew,
              sortOrder: item.sortOrder,
            }))
          )
          .run();
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update nav items" },
      { status: 500 }
    );
  }
}
