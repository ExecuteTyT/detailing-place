import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { liveStatus } from "@/lib/db/schema";

export async function GET() {
  try {
    const rows = db.select().from(liveStatus).all();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch live status" },
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
        car: string;
        service: string;
      }>;
    };

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    db.transaction((tx) => {
      tx.delete(liveStatus).run();
      if (items.length > 0) {
        tx.insert(liveStatus)
          .values(
            items.map((item) => ({
              car: item.car,
              service: item.service,
            }))
          )
          .run();
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update live status" },
      { status: 500 }
    );
  }
}
