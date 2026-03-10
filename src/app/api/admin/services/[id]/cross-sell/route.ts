import { db } from "@/lib/db";
import { serviceCrossSell } from "@/lib/db/schema";
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
    .from(serviceCrossSell)
    .where(eq(serviceCrossSell.serviceId, serviceId));

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
    .from(serviceCrossSell)
    .where(eq(serviceCrossSell.serviceId, serviceId));

  if (existing) {
    const [updated] = await db
      .update(serviceCrossSell)
      .set({
        title: body.title,
        description: body.description,
        href: body.href,
        discount: body.discount ?? null,
      })
      .where(eq(serviceCrossSell.serviceId, serviceId))
      .returning();

    return NextResponse.json(updated);
  }

  const [created] = await db
    .insert(serviceCrossSell)
    .values({
      serviceId,
      title: body.title,
      description: body.description,
      href: body.href,
      discount: body.discount ?? null,
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
    .delete(serviceCrossSell)
    .where(eq(serviceCrossSell.serviceId, serviceId));

  return NextResponse.json({ success: true });
}
