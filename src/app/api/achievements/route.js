import { db } from "../../../../utils/dbConfig";
import { Achievements } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([], { status: 400 });

  const achievements = await db
    .select()
    .from(Achievements)
    .where(eq(Achievements.userId, userId));

  return NextResponse.json(achievements);
}
