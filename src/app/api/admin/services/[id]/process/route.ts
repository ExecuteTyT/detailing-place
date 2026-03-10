import { db } from "@/lib/db";
import { serviceProcessSteps } from "@/lib/db/schema";
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
    .from(serviceProcessSteps)
    .where(eq(serviceProcessSteps.serviceId, serviceId))
    .orderBy(asc(serviceProcessSteps.sortOrder));

  return NextResponse.json(rows);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const serviceId = Number(id);
  const body = await request.json();
  const { steps } = body as {
    steps: Array<{ title: string; description: string; sortOrder: number }>;
  };

  await db.transaction(async (tx) => {
    await tx
      .delete(serviceProcessSteps)
      .where(eq(serviceProcessSteps.serviceId, serviceId));

    if (steps.length) {
      await tx.insert(serviceProcessSteps).values(
        steps.map((step) => ({
          serviceId,
          title: step.title,
          description: step.description,
          sortOrder: step.sortOrder,
        })),
      );
    }
  });

  return NextResponse.json({ success: true });
}
