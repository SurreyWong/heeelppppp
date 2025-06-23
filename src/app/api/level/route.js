import { db } from "../../../../utils/dbConfig";
import { UserLogins } from "../../../../utils/schema";
import { eq } from "drizzle-orm";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  // Fetch login records
  const rows = await db
    .select()
    .from(UserLogins)
    .where(eq(UserLogins.userId, userId));

  // Extract only the date portion (YYYY-MM-DD)
  const loginDates = new Set(rows.map((row) => row.loginDate.slice(0, 10)));

  console.log("Login Dates:", loginDates);

  let streak = 0;
  const today = new Date();
  const todayFormatted = today.toISOString().slice(0, 10);
  console.log("Today:", todayFormatted);

  // Count streak: check today, yesterday, etc.
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const formatted = checkDate.toISOString().slice(0, 10);

    const hasLogin = loginDates.has(formatted);
    console.log(`Checking ${formatted}:`, hasLogin);

    if (hasLogin) {
      streak++;
    } else {
      break;
    }
  }

  const level = streak === 7 ? 2 : 1;
  console.log("Streak Counted:", streak);
  console.log("Level:", level);

  return Response.json({ level });
}
