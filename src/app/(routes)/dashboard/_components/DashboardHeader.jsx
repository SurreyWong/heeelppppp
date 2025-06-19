import {UserButton, useUser, ClerkProvider} from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {Moon, Sun, Award, Trophy, Gift, Medal} from "lucide-react";
import "../../../../../css/theme.css";

function DashboardHeader() {
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [badges, setBadges] = useState([]);


  useEffect(() => {
    const theme = localStorage.getItem("darkmode");
    if (theme === "active") {
      document.body.classList.add("darkmode");
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
  const fetchBadges = async () => {
    const userId = user?.primaryEmailAddress?.emailAddress;
    if (!userId) return;
    const res = await fetch(`/api/achievements?userId=${userId}`);
    const data = await res.json();
    const claimed = data.filter((b) => b.claimed === 1);
    setBadges(claimed);
  };

  fetchBadges();

  window.addEventListener("achievement-claimed", fetchBadges);
  return () => window.removeEventListener("achievement-claimed", fetchBadges);
}, [user]);



  const toggleTheme = () => {
    const current = localStorage.getItem("darkmode");
    if (current !== "active") {
      document.body.classList.add("darkmode");
      localStorage.setItem("darkmode", "active");
      setDarkMode(true);
    } else {
      document.body.classList.remove("darkmode");
      localStorage.setItem("darkmode", null);
      setDarkMode(false);
    }
  };

  const badgeIconMap = {
    "First Tracker": Award,
    "Pennywise": Gift,
    "Explorer": Medal,
    "Budget Pro": Trophy,
  };
  

  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
      <div></div>
      <div className="flex gap-2 items-center">
        {badges.map((badge) => {
          const Icon = badgeIconMap[badge.name];
          return Icon ? (
            <Icon key={badge.name} size={20} title={badge.name} className="text-yellow-500" />
          ) : null;
        })}
      </div>
      <div className="flex items-center gap-4">
        <button id="theme" onClick={toggleTheme}>
          {darkMode ? <Sun /> : <Moon />}
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default DashboardHeader;
