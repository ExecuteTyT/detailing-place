import { db } from "@/lib/db";
import { servicePackages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pkgId: string }> },
) {
  const { pkgId } = await params;
  const packageId = Number(pkgId);
  const body = await request.json();

  const [updated] = await db
    .update(servicePackages)
    .set(body)
    .where(eq(servicePackages.id, packageId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pkgId: string }> },
) {
  const { pkgId } = await params;
  const packageId = Number(pkgId);

  await db.delete(servicePackages).where(eq(servicePackages.id, packageId));

  return NextResponse.json({ success: true });
}
