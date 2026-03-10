import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const rows = await db
    .select({
      id: services.id,
      slug: services.slug,
      title: services.title,
      isActive: services.isActive,
      sortOrder: services.sortOrder,
      showOnHomepage: services.showOnHomepage,
    })
    .from(services)
    .orderBy(asc(services.sortOrder));

  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const [created] = await db
    .insert(services)
    .values({
      slug: body.slug,
      title: body.title,
      h1: body.h1,
      subtitle: body.subtitle,
      badge: body.badge ?? null,
      seoText: body.seoText,
      hasBeforeAfter: body.hasBeforeAfter,
      uniqueBlock: body.uniqueBlock ?? null,
      sortOrder: body.sortOrder,
      isActive: body.isActive,
      showOnHomepage: body.showOnHomepage,
      homepageSortOrder: body.homepageSortOrder,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
