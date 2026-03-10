import { db } from "@/lib/db";
import { works, workTags } from "@/lib/db/schema";
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
    .from(works)
    .where(eq(works.serviceId, serviceId))
    .orderBy(asc(works.sortOrder));

  const result = await Promise.all(
    rows.map(async (work) => {
      const tags = await db
        .select()
        .from(workTags)
        .where(eq(workTags.workId, work.id));

      return { ...work, tags: tags.map((t) => t.tag) };
    }),
  );

  return NextResponse.json(result);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);
  const body = await request.json();
  const { works: worksData } = body as {
    works: Array<{
      car: string;
      image: string;
      tags: string[];
      sortOrder: number;
    }>;
  };

  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: works.id })
      .from(works)
      .where(eq(works.serviceId, serviceId));

    for (const w of existing) {
      await tx.delete(workTags).where(eq(workTags.workId, w.id));
    }

    await tx.delete(works).where(eq(works.serviceId, serviceId));

    for (const w of worksData) {
      const [inserted] = await tx
        .insert(works)
        .values({
          serviceId,
          car: w.car,
          image: w.image,
          sortOrder: w.sortOrder,
        })
        .returning();

      if (w.tags?.length) {
        await tx.insert(workTags).values(
          w.tags.map((tag) => ({
            workId: inserted.id,
            tag,
          })),
        );
      }
    }
  });

  return NextResponse.json({ success: true });
}
