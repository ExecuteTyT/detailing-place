import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.date));
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const [post] = await db
    .insert(blogPosts)
    .values({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt ?? "",
      content: body.content ?? null,
      image: body.image,
      category: body.category,
      date: body.date,
      isFeatured: body.isFeatured ?? false,
    })
    .returning();

  return NextResponse.json(post, { status: 201 });
}
