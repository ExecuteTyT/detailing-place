import { db } from "@/lib/db";
import {
  servicePackages,
  packageClassPrices,
  packageFeatures,
} from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);

  const pkgs = await db
    .select()
    .from(servicePackages)
    .where(eq(servicePackages.serviceId, serviceId))
    .orderBy(asc(servicePackages.sortOrder));

  const result = await Promise.all(
    pkgs.map(async (pkg) => {
      const features = await db
        .select()
        .from(packageFeatures)
        .where(eq(packageFeatures.packageId, pkg.id))
        .orderBy(asc(packageFeatures.sortOrder));

      const prices = await db
        .select()
        .from(packageClassPrices)
        .where(eq(packageClassPrices.packageId, pkg.id));

      return { ...pkg, features, prices };
    }),
  );

  return NextResponse.json(result);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);
  const body = await request.json();

  const [created] = await db
    .insert(servicePackages)
    .values({
      serviceId,
      name: body.name,
      description: body.description,
      isPopular: body.isPopular ?? false,
      duration: body.duration ?? null,
      sortOrder: body.sortOrder,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);
  const body = await request.json();
  const { packages } = body as {
    packages: Array<{
      name: string;
      description: string;
      isPopular?: boolean;
      duration?: string | null;
      sortOrder: number;
      features?: Array<{ text: string; sortOrder: number }>;
      prices?: Array<{ carClassId: number | null; priceText: string | null }>;
    }>;
  };

  await db.transaction(async (tx) => {
    await tx
      .delete(servicePackages)
      .where(eq(servicePackages.serviceId, serviceId));

    for (const pkg of packages) {
      const [inserted] = await tx
        .insert(servicePackages)
        .values({
          serviceId,
          name: pkg.name,
          description: pkg.description,
          isPopular: pkg.isPopular ?? false,
          duration: pkg.duration ?? null,
          sortOrder: pkg.sortOrder,
        })
        .returning();

      if (pkg.features?.length) {
        await tx.insert(packageFeatures).values(
          pkg.features.map((f) => ({
            packageId: inserted.id,
            text: f.text,
            sortOrder: f.sortOrder,
          })),
        );
      }

      if (pkg.prices?.length) {
        await tx.insert(packageClassPrices).values(
          pkg.prices.map((p) => ({
            packageId: inserted.id,
            carClassId: p.carClassId,
            priceText: p.priceText,
          })),
        );
      }
    }
  });

  return NextResponse.json({ success: true });
}
