import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const allReviews = await db
    .select()
    .from(reviews)
    .orderBy(asc(reviews.sortOrder));

  return NextResponse.json(allReviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const [review] = await db
    .insert(reviews)
    .values({
      author: body.author,
      rating: body.rating ?? 5,
      text: body.text,
      car: body.car ?? null,
      date: body.date ?? null,
      isVisible: body.isVisible ?? true,
      sortOrder: body.sortOrder ?? 0,
    })
    .returning();

  return NextResponse.json(review, { status: 201 });
}
