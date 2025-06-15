import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId } = auth(); // Get logged-in user
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name, amount, budgetId } = await req.json();

  if (!name || !amount) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  await db.insert(Expenses).values({
    name,
    amount,
    budgetId,
    createdAt: new Date().toISOString(),
    createdBy,
  });

  return new NextResponse("Expense added", { status: 201 });
}
