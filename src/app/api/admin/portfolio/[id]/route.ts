import { db } from "@/lib/db";
import { works, workTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itemId = Number(id);

  const work = await db.query.works.findFirst({
    where: (w, { eq }) => eq(w.id, itemId),
    with: { tags: true },
  });

  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(work);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itemId = Number(id);
  const body = await request.json();

  const [updated] = await db
    .update(works)
    .set({
      slug: body.slug,
      car: body.car,
      serviceName: body.serviceName,
      image: body.image,
      sortOrder: body.sortOrder,
    })
    .where(eq(works.id, itemId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Replace tags: delete existing, insert new
  await db.delete(workTags).where(eq(workTags.workId, itemId));

  if (body.tags && body.tags.length > 0) {
    await db.insert(workTags).values(
      body.tags.map((tag: string) => ({
        workId: itemId,
        tag,
      }))
    );
  }

  const result = await db.query.works.findFirst({
    where: (w, { eq }) => eq(w.id, itemId),
    with: { tags: true },
  });

  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itemId = Number(id);

  await db.delete(works).where(eq(works.id, itemId));

  return NextResponse.json({ success: true });
}
