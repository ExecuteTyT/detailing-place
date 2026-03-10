import { db } from "@/lib/db";
import { works, workTags } from "@/lib/db/schema";
import { asc, isNotNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const items = await db.query.works.findMany({
    where: isNotNull(works.slug),
    orderBy: asc(works.sortOrder),
    with: { tags: true },
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const [work] = await db
    .insert(works)
    .values({
      slug: body.slug,
      car: body.car,
      serviceName: body.serviceName ?? null,
      image: body.image,
      sortOrder: body.sortOrder ?? 0,
    })
    .returning();

  if (body.tags && body.tags.length > 0) {
    await db.insert(workTags).values(
      body.tags.map((tag: string) => ({
        workId: work.id,
        tag,
      }))
    );
  }

  const created = await db.query.works.findFirst({
    where: (w, { eq }) => eq(w.id, work.id),
    with: { tags: true },
  });

  return NextResponse.json(created, { status: 201 });
}
