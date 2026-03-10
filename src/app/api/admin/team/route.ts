import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const members = await db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder));

  return NextResponse.json(members);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  // Delete all existing members and insert new ones
  await db.delete(teamMembers);

  if (body.members && body.members.length > 0) {
    await db.insert(teamMembers).values(
      body.members.map(
        (m: { name: string; role: string; image: string; sortOrder: number }) => ({
          name: m.name,
          role: m.role,
          image: m.image,
          sortOrder: m.sortOrder ?? 0,
        })
      )
    );
  }

  const updated = await db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder));

  return NextResponse.json(updated);
}
