"use client";
import { DateTime } from "luxon";
import { logError } from "./logger";

export default function normalizeToSeconds(
  type: "date" | "time" | "datetime" | "duration",
  value: string | number
): number {
  try {
    // Use browser's local timezone (no hard-coded zone)
    switch (type) {
      case "date": {
        const dt = DateTime.fromISO(value as string).startOf("day");
        return Math.floor(dt.toSeconds());
      }
      case "time": {
        const [hours, minutes] = (value as string).split(":").map(Number);
        // Get current date/time in browser's local timezone
        const now = DateTime.now();
        const dt = now.set({
          hour: hours,
          minute: minutes,
          second: 0,
          millisecond: 0,
        });
        return Math.floor(dt.toSeconds());
      }
      case "datetime": {
        // Parse the datetime string as browser's local timezone
        const dt = DateTime.fromISO(value as string);
        return Math.floor(dt.toSeconds());
      }
      case "duration": {
        return Math.floor(Number(value));
      }
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  } catch (err) {
    logError("normalizeToSeconds error:", err);
    return 0;
  }
}
