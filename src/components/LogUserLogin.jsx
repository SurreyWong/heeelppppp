"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

function LogUserLogin() {
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetch("/api/log-login", {
        method: "POST",
        body: JSON.stringify({
          userId: user.primaryEmailAddress.emailAddress,
        }),
      });
    }
  }, [user]);

  return null;
}

export default LogUserLogin;
