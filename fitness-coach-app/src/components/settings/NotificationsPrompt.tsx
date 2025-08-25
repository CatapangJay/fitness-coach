"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { subscribeUserToPush } from "@/lib/push";

export default function NotificationsPrompt() {
  const [supported, setSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission | "unknown">("unknown");

  useEffect(() => {
    const isSupported = typeof window !== "undefined" && "Notification" in window;
    setSupported(isSupported);
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, []);

  if (!supported) return null;
  if (permission === "granted") return null;

  const request = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        // Try to subscribe to push
        const ok = await subscribeUserToPush();
        if (ok) {
          toast.success("Notifications enabled. We'll keep you posted! 🎉");
        } else {
          toast.message("Notifications enabled, but push subscription is not configured.", {
            description: "Set NEXT_PUBLIC_VAPID_PUBLIC_KEY to enable Web Push.",
          });
        }
        // Optional local welcome
        try {
          new Notification("Fitness Coach", {
            body: "You're all set! We'll send reminders and progress updates.",
            icon: "/icons/icon-192.png",
          });
        } catch (_) {}
      } else if (result === "denied") {
        toast.error("Notifications blocked. You can enable them in your browser settings.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Unable to request notification permission.");
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Bell className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Enable notifications</p>
          <p className="text-xs text-gray-600">
            Get workout reminders, progress celebrations, and schedule alerts.
          </p>
          <div className="mt-3 flex gap-2">
            {permission !== "denied" ? (
              <Button size="sm" onClick={request}>Allow</Button>
            ) : (
              <Button size="sm" variant="outline" asChild>
                <a href="https://support.google.com/chrome/answer/3220216" target="_blank" rel="noreferrer">How to enable</a>
              </Button>
            )}
            <Button size="sm" variant="ghost">Maybe later</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
