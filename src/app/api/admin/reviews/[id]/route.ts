import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itemId = Number(id);

  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, itemId));

  if (!review) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(review);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itemId = Number(id);
  const body = await request.json();

  const [updated] = await db
    .update(reviews)
    .set({
      author: body.author,
      rating: body.rating,
      text: body.text,
      car: body.car,
      date: body.date,
      isVisible: body.isVisible,
      sortOrder: body.sortOrder,
    })
    .where(eq(reviews.id, itemId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itemId = Number(id);

  await db.delete(reviews).where(eq(reviews.id, itemId));

  return NextResponse.json({ success: true });
}
