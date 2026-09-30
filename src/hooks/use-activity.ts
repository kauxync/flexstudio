"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";

export function useActivity() {
  const { data: session } = useSession();

  const log = useCallback(
    async (action: string, details?: Record<string, any>) => {
      if (!session?.user) return;
      try {
        await fetch("/api/activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, details }),
        });
      } catch {
        // Silent fail — don't block user experience
      }
    },
    [session]
  );

  return { log };
}
