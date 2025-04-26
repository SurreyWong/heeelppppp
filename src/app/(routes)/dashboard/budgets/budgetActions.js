'use server';

import { db } from '../../../../../utils/dbConfig';
import { Budgets } from '../../../../../utils/schema';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function createBudget({ name, amount, icon }) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const result = await db.insert(Budgets).values({
    name,
    amount,
    icon,
    createdBy: userId, // store userId instead of email (better)
  }).returning({ insertedId: Budgets.id });

  revalidatePath('/dashboard/expenses');
  return result;
}
