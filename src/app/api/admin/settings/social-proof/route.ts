import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialProof } from "@/lib/db/schema";

export async function GET() {
  try {
    const rows = db.select().from(socialProof).all();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch social proof items" },
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
        car: string;
        service: string;
        minutesAgo: number;
      }>;
    };

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    db.transaction((tx) => {
      tx.delete(socialProof).run();
      if (items.length > 0) {
        tx.insert(socialProof)
          .values(
            items.map((item) => ({
              name: item.name,
              car: item.car,
              service: item.service,
              minutesAgo: item.minutesAgo,
            }))
          )
          .run();
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update social proof items" },
      { status: 500 }
    );
  }
}
