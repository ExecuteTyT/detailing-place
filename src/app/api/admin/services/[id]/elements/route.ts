import { db } from "@/lib/db";
import { elementPrices, elementClassPrices } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);

  const elements = await db
    .select()
    .from(elementPrices)
    .where(eq(elementPrices.serviceId, serviceId))
    .orderBy(asc(elementPrices.sortOrder));

  const result = await Promise.all(
    elements.map(async (el) => {
      const prices = await db
        .select()
        .from(elementClassPrices)
        .where(eq(elementClassPrices.elementPriceId, el.id));

      return { ...el, prices };
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
  const { elements } = body as {
    elements: Array<{
      elementName: string;
      sortOrder: number;
      prices: Array<{ carClassId: number | null; priceText: string | null }>;
    }>;
  };

  await db.transaction(async (tx) => {
    await tx
      .delete(elementPrices)
      .where(eq(elementPrices.serviceId, serviceId));

    for (const el of elements) {
      const [inserted] = await tx
        .insert(elementPrices)
        .values({
          serviceId,
          elementName: el.elementName,
          sortOrder: el.sortOrder,
        })
        .returning();

      if (el.prices?.length) {
        await tx.insert(elementClassPrices).values(
          el.prices.map((p) => ({
            elementPriceId: inserted.id,
            carClassId: p.carClassId,
            priceText: p.priceText,
          })),
        );
      }
    }
  });

  return NextResponse.json({ success: true });
}
