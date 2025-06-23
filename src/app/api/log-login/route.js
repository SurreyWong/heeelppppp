import { db } from "../../../../utils/dbConfig";
import { UserLogins } from "../../../../utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { userId } = await req.json();
  const today = new Date().toISOString().slice(0, 10);

  const existing = await db
    .select()
    .from(UserLogins)
    .where(eq(UserLogins.userId, userId));

  const alreadyLoggedToday = existing.some((entry) => entry.loginDate === today);
  if (!alreadyLoggedToday) {
    await db.insert(UserLogins).values({
      userId,
      loginDate: today,
    });
  }

  return new Response("OK");
}
