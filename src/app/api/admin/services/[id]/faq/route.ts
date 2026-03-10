import { db } from "@/lib/db";
import { serviceFaq } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);

  const rows = await db
    .select()
    .from(serviceFaq)
    .where(eq(serviceFaq.serviceId, serviceId))
    .orderBy(asc(serviceFaq.sortOrder));

  return NextResponse.json(rows);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);
  const body = await request.json();
  const { items } = body as {
    items: Array<{ question: string; answer: string; sortOrder: number }>;
  };

  await db.transaction(async (tx) => {
    await tx.delete(serviceFaq).where(eq(serviceFaq.serviceId, serviceId));

    if (items.length) {
      await tx.insert(serviceFaq).values(
        items.map((item) => ({
          serviceId,
          question: item.question,
          answer: item.answer,
          sortOrder: item.sortOrder,
        })),
      );
    }
  });

  return NextResponse.json({ success: true });
}
