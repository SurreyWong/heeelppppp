import { db } from "../../../../utils/dbConfig";
import { Achievements } from "../../../../utils/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

const ALL_ACHIEVEMENTS = [
  { name: "First Tracker", description: "Log your first expense", target: 1 },
  { name: "Pennywise", description: "Log 50 small expenses (< RM50)", target: 50 },
  { name: "Explorer", description: "Create 10 categories", target: 10 },
  { name: "Budget Pro", description: "Create 10 budgets", target: 10 },
];

export async function GET() {
  try {
    const { user } = auth();
    const userId = user?.primaryEmailAddress?.emailAddress;
    let userRows = [];

    if (userId) {
      userRows = await db
        .select()
        .from(Achievements)
        .where(eq(Achievements.userId, userId));
    }

    const results = ALL_ACHIEVEMENTS.map((ach) => {
      const row = userRows.find((r) => r.name === ach.name);
      return {
        ...ach,
        current: row ? row.progress : 0,
        earned: Boolean(row?.earned),
        claimed: Boolean(row?.claimed),
      };
    });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("/api/achievements GET error", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
