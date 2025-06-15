"use client";
import React, { useEffect, useState } from "react";
import AchievementCard from "./AchievementCard";
import { Button } from "@/components/ui/button";

const AchievementList = () => {
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await fetch("/api/achievements");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[150px] bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-7">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((ach) => (
          <AchievementCard key={ach.name} ach={ach} />
        ))}
      </div>
    </div>
  );
};

export default AchievementList;