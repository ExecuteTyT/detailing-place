import { db } from "@/lib/db";
import { packageClassPrices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pkgId: string }> },
) {
  const { pkgId } = await params;
  const packageId = Number(pkgId);

  const rows = await db
    .select({
      carClassId: packageClassPrices.carClassId,
      priceText: packageClassPrices.priceText,
    })
    .from(packageClassPrices)
    .where(eq(packageClassPrices.packageId, packageId));

  return NextResponse.json(rows);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pkgId: string }> },
) {
  const { pkgId } = await params;
  const packageId = Number(pkgId);
  const body = await request.json();
  const { prices } = body as {
    prices: Array<{ carClassId: number | null; priceText: string | null }>;
  };

  await db.transaction(async (tx) => {
    await tx
      .delete(packageClassPrices)
      .where(eq(packageClassPrices.packageId, packageId));

    if (prices.length) {
      await tx.insert(packageClassPrices).values(
        prices.map((p) => ({
          packageId,
          carClassId: p.carClassId,
          priceText: p.priceText,
        })),
      );
    }
  });

  return NextResponse.json({ success: true });
}
