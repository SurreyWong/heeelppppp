"use client";
import {
  Award,
  Gift,
  Medal,
  Trophy,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../utils/dbConfig";
import {
  Incomes,
  Expenses,
  Budgets,
  Achievements,
} from "../../../../../utils/schema";
import { eq, and } from "drizzle-orm";

const ALL_ACHIEVEMENTS = [
  {
    name: "First Tracker",
    description: "Log your first expense",
    target: 1,
    icon: Award,
  },
  {
    name: "Pennywise",
    description: "Log 50 small expenses (< RM50)",
    target: 50,
    icon: Gift,
  },
  {
    name: "Explorer",
    description: "Create 10 incomes",
    target: 10,
    icon: Medal,
  },
  {
    name: "Budget Pro",
    description: "Create 10 budgets",
    target: 10,
    icon: Trophy,
  },
];

function AchievementPage() {
  const { user } = useUser();
  const [userAchievements, setUserAchievements] = useState([]);

  // Claim handler
  const handleClaim = async (name) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    const userId = user.primaryEmailAddress.emailAddress;

    await db
      .update(Achievements)
      .set({ claimed: 1 })
      .where(
        and(eq(Achievements.userId, userId), eq(Achievements.name, name))
      );

    // Dispatch custom event to refresh header badges
    window.dispatchEvent(new Event("achievement-claimed"));

    // Refresh local achievement state
    const updated = await db
      .select()
      .from(Achievements)
      .where(eq(Achievements.userId, userId));

    setUserAchievements(updated);
  };


  useEffect(() => {
    const syncAchievements = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const userId = user.primaryEmailAddress.emailAddress;

      // Ensure achievements exist
      const existingAchievements = await db
        .select()
        .from(Achievements)
        .where(eq(Achievements.userId, userId));

      const existingNames = new Set(existingAchievements.map((a) => a.name));

      const missingAchievements = ALL_ACHIEVEMENTS.filter(
        (a) => !existingNames.has(a.name)
      );

      if (missingAchievements.length > 0) {
        await db.insert(Achievements).values(
          missingAchievements.map((a) => ({
            userId,
            name: a.name,
            target: a.target,
            earned: 0,
            claimed: 0,
            progress: 0,
          }))
        );
      }

      // Gather progress data
      const expenses = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.createdBy, userId));

      const smallExpenses = expenses.filter((e) => parseFloat(e.amount) < 50);

      const budgets = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, userId));

      const incomes = await db
        .select()
        .from(Incomes)
        .where(eq(Incomes.createdBy, userId));

      // Build progress
      const progressMap = {
        "First Tracker": expenses.length,
        "Pennywise": smallExpenses.length,
        "Explorer": incomes.length,
        "Budget Pro": budgets.length,
      };

      for (const ach of ALL_ACHIEVEMENTS) {
        let current = progressMap[ach.name] || 0;

        if (ach.name === "First Tracker") {
          current = Math.min(current, 1);
        }

        const unlocked = current >= ach.target;
        const existingAchievement = existingAchievements.find(a => a.name === ach.name);
        const alreadyClaimed = existingAchievement?.claimed === 1;

        // Freeze progress if already claimed
        if (!alreadyClaimed) {
          await db
            .update(Achievements)
            .set({
              progress: current,
              earned: unlocked ? 1 : 0,
            })
            .where(
              and(
                eq(Achievements.userId, userId),
                eq(Achievements.name, ach.name)
              )
            );
        }
      }


      // Fetch updated achievements
      const updated = await db
        .select()
        .from(Achievements)
        .where(eq(Achievements.userId, userId));

      setUserAchievements(updated);
    };

    syncAchievements();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>
      <div className="grid gap-4">
        {userAchievements.map((ach) => {
          const meta = ALL_ACHIEVEMENTS.find((a) => a.name === ach.name);
          const Icon = meta?.icon;

          return (
            <div
              key={ach.name}
              className={`border p-4 rounded-xl flex items-start gap-4 ${ach.earned ? "bg-green-100 border-green-500" : "bg-white"
                }`}
            >
              {Icon && <Icon className="w-6 h-6 mt-1 text-green-600" />}
              <div>
                <h2 className="text-lg font-semibold">{ach.name}</h2>
                <p className="text-gray-600">{meta?.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Progress: {ach.progress} / {ach.target}
                </div>

                {ach.earned && ach.claimed === 0 && (
                  <button
                    onClick={() => handleClaim(ach.name)}
                    className="mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Claim Reward
                  </button>
                )}

                {ach.earned && ach.claimed === 1 && (
                  <span className="text-green-600 font-semibold">✅ Claimed</span>
                )}

                {!ach.earned && ach.claimed === 0 && (
                  <span className="text-gray-400 italic"> Unclaimed</span>
                )}


              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AchievementPage;
