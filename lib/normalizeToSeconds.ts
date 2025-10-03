'use client'
import { DateTime } from "luxon";
import { logError } from "./logger";

export default function normalizeToSeconds(
  type: "date" | "time" | "datetime" | "duration",
  value: string | number
): number {
  try {
    // This will automatically use PST or PDT depending on the date
    const PST = "America/Los_Angeles";

    switch (type) {
      case "date": {
        const dt = DateTime.fromISO(value as string, { zone: PST }).startOf("day");
        return Math.floor(dt.toSeconds());
      }
      case "time": {
        const [hours, minutes] = (value as string).split(":").map(Number);
        // Get current date/time in PST timezone
        const now = DateTime.now().setZone(PST);
        const dt = now.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
        return Math.floor(dt.toSeconds());
      }
      case "datetime": {
        // Parse the datetime string as PST timezone
        const dt = DateTime.fromISO(value as string, { zone: PST });
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