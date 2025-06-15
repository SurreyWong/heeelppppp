"use client";
import React from "react";

const AchievementCard = ({ ach }) => {
  const pct = Math.min((ach.current / ach.target) * 100, 100);

  return (
    <div
      className={`p-5 rounded-2xl border hover:shadow md transition ${
        ach.earned ? "bg-green-50 border-green-400" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">{ach.name}</h2>
        {ach.earned && (
          <span className="text-green-700 text-sm font-semibold">✅ Earned</span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-1">{ach.description}</p>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>
            {ach.current} / {ach.target}
          </span>
          <span>{pct.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-300 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${
              ach.earned ? "bg-green-600" : "bg-primary"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;