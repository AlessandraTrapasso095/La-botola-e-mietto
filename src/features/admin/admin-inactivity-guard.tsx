"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  ADMIN_ACTIVITY_STORAGE_KEY,
  ADMIN_INACTIVITY_TIMEOUT_MS,
} from "@/features/admin/admin-session";

const ACTIVITY_THROTTLE_MS = 1_000;

export function AdminInactivityGuard() {
  const router = useRouter();

  useEffect(() => {
    let timeoutId: number | null = null;
    let lastRecordedActivity = 0;
    let logoutInProgress = false;

    function clearTimer() {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    }

    async function logoutForInactivity() {
      if (logoutInProgress) {
        return;
      }

      logoutInProgress = true;
      clearTimer();

      try {
        window.localStorage.removeItem(ADMIN_ACTIVITY_STORAGE_KEY);

        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
        });
      } finally {
        router.replace("/admin/login?sessione=scaduta");
        router.refresh();
      }
    }

    function getLastActivity() {
      const stored = window.localStorage.getItem(
        ADMIN_ACTIVITY_STORAGE_KEY,
      );

      const parsed = stored ? Number(stored) : Number.NaN;

      return Number.isFinite(parsed) ? parsed : null;
    }

    function scheduleLogout() {
      clearTimer();

      const lastActivity = getLastActivity();

      if (lastActivity === null) {
        const now = Date.now();

        window.localStorage.setItem(
          ADMIN_ACTIVITY_STORAGE_KEY,
          String(now),
        );

        lastRecordedActivity = now;

        timeoutId = window.setTimeout(
          logoutForInactivity,
          ADMIN_INACTIVITY_TIMEOUT_MS,
        );

        return;
      }

      const remaining =
        ADMIN_INACTIVITY_TIMEOUT_MS - (Date.now() - lastActivity);

      if (remaining <= 0) {
        void logoutForInactivity();
        return;
      }

      timeoutId = window.setTimeout(logoutForInactivity, remaining);
    }

    function recordActivity() {
      if (logoutInProgress) {
        return;
      }

      const now = Date.now();

      if (now - lastRecordedActivity < ACTIVITY_THROTTLE_MS) {
        return;
      }

      lastRecordedActivity = now;

      window.localStorage.setItem(
        ADMIN_ACTIVITY_STORAGE_KEY,
        String(now),
      );

      scheduleLogout();
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === ADMIN_ACTIVITY_STORAGE_KEY) {
        scheduleLogout();
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        scheduleLogout();
      }
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "pointerdown",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, {
        passive: true,
      });
    });

    window.addEventListener("storage", handleStorage);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    scheduleLogout();

    return () => {
      clearTimer();

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });

      window.removeEventListener("storage", handleStorage);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [router]);

  return null;
}
