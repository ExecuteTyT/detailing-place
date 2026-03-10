import { db } from "@/lib/db";
import { serviceKeywords } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);

  const rows = await db
    .select()
    .from(serviceKeywords)
    .where(eq(serviceKeywords.serviceId, serviceId));

  return NextResponse.json(rows);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);
  const body = await request.json();
  const { keywords } = body as { keywords: string[] };

  await db.transaction(async (tx) => {
    await tx
      .delete(serviceKeywords)
      .where(eq(serviceKeywords.serviceId, serviceId));

    if (keywords.length) {
      await tx.insert(serviceKeywords).values(
        keywords.map((keyword) => ({
          serviceId,
          keyword,
        })),
      );
    }
  });

  return NextResponse.json({ success: true });
}
