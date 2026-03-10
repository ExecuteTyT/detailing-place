import { db } from "@/lib/db";
import { serviceBeforeAfter } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);

  const [row] = await db
    .select()
    .from(serviceBeforeAfter)
    .where(eq(serviceBeforeAfter.serviceId, serviceId));

  return NextResponse.json(row ?? null);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);
  const body = await request.json();

  const [existing] = await db
    .select()
    .from(serviceBeforeAfter)
    .where(eq(serviceBeforeAfter.serviceId, serviceId));

  if (existing) {
    const [updated] = await db
      .update(serviceBeforeAfter)
      .set({
        beforeImage: body.beforeImage,
        afterImage: body.afterImage,
        beforeLabel: body.beforeLabel,
        afterLabel: body.afterLabel,
      })
      .where(eq(serviceBeforeAfter.serviceId, serviceId))
      .returning();

    return NextResponse.json(updated);
  }

  const [created] = await db
    .insert(serviceBeforeAfter)
    .values({
      serviceId,
      beforeImage: body.beforeImage,
      afterImage: body.afterImage,
      beforeLabel: body.beforeLabel,
      afterLabel: body.afterLabel,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);

  await db
    .delete(serviceBeforeAfter)
    .where(eq(serviceBeforeAfter.serviceId, serviceId));

  return NextResponse.json({ success: true });
}
