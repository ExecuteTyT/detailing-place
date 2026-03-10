import { db } from "@/lib/db";
import { packageFeatures } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pkgId: string }> },
) {
  const { pkgId } = await params;
  const packageId = Number(pkgId);

  const rows = await db
    .select()
    .from(packageFeatures)
    .where(eq(packageFeatures.packageId, packageId))
    .orderBy(asc(packageFeatures.sortOrder));

  return NextResponse.json(rows);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pkgId: string }> },
) {
  const { pkgId } = await params;
  const packageId = Number(pkgId);
  const body = await request.json();
  const { features } = body as {
    features: Array<{ text: string; sortOrder: number }>;
  };

  await db.transaction(async (tx) => {
    await tx
      .delete(packageFeatures)
      .where(eq(packageFeatures.packageId, packageId));

    if (features.length) {
      await tx.insert(packageFeatures).values(
        features.map((f) => ({
          packageId,
          text: f.text,
          sortOrder: f.sortOrder,
        })),
      );
    }
  });

  return NextResponse.json({ success: true });
}
