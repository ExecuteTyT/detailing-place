import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { invalidateSettingsCache } from "@/lib/db/queries/settings";

export async function GET() {
  try {
    const rows = db.select().from(settings).all();
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings: settingsData } = body as {
      settings: Record<string, string>;
    };

    if (!settingsData || typeof settingsData !== "object") {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    db.transaction((tx) => {
      for (const [key, value] of Object.entries(settingsData)) {
        const existing = tx
          .select()
          .from(settings)
          .where(eq(settings.key, key))
          .get();

        if (existing) {
          tx.update(settings)
            .set({ value })
            .where(eq(settings.key, key))
            .run();
        } else {
          tx.insert(settings).values({ key, value }).run();
        }
      }
    });

    invalidateSettingsCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
