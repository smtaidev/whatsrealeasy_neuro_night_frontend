"use client";

import { env } from "@/env";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminCalendarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Handle OAuth callback
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const email = searchParams.get("email");

    if (success === "true") {
      setMessage({
        type: "success",
        text: `Calendar connected: ${email}`,
      });
      setTimeout(() => {
        setMessage(null);
        router.replace("/dashboard/super-admin/outbound/calender");
      }, 3000);
    } else if (error) {
      const errors: Record<string, string> = {
        unauthorized: `Unauthorized: ${email}`,
        no_email: "No email found",
        userinfo_failed: "Failed to get user info",
      };
      setMessage({
        type: "error",
        text: errors[error] || "Authentication failed",
      });
      setTimeout(() => {
        setMessage(null);
        router.replace("/dashboard/super-admin/outbound/calender");
      }, 5000);
    }
  }, [searchParams, router]);

  const handleClick = async () => {
    try {
      const res = await fetch("/api/auth/initiate");
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: "error", text: "No auth URL found" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Connection failed" });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6 bg-white gap-4 w-full">
      {/* Message notification */}
      {message && (
        <div
          className={`w-full p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Auth button */}
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Authenticate with Google
      </button>

      {/* Calendar iframe */}
      <iframe
        src={`https://calendar.google.com/calendar/embed?src=${env.NEXT_PUBLIC_OUTBOUND_EMAIL}`}
        style={{
          border: "0",
          backgroundColor: "transparent",
        }}
        width="100%"
        height="100%"
        className="h-[calc(100vh-155px)] bg-dark3"
      />
    </div>
  );
}