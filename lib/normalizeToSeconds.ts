import { logError } from "./logger";

export default function normalizeToSeconds(
  type: "date" | "time" | "datetime" | "duration",
  value: string | number
): number {
  try {
    const LA_TIMEZONE = "America/Los_Angeles";

    switch (type) {
      case "date": {
        const d = new Date(value as string);
        // Create date string in LA timezone
        const laDate = new Date(
          d.toLocaleString("en-US", { timeZone: LA_TIMEZONE })
        );
        laDate.setHours(0, 0, 0, 0);
        return Math.floor(laDate.getTime() / 1000);
      }
      case "time": {
        const [hours, minutes] = (value as string).split(":").map(Number);
        // Get current date in LA timezone
        const now = new Date();
        const d = new Date(
          now.toLocaleString("en-US", { timeZone: LA_TIMEZONE })
        );
        d.setHours(hours, minutes, 0, 0);
        return Math.floor(d.getTime() / 1000);
      }
      case "datetime": {
        const d = new Date(value as string);
        // Convert to LA timezone
        const laDateTime = new Date(
          d.toLocaleString("en-US", { timeZone: LA_TIMEZONE })
        );
        return Math.floor(laDateTime.getTime() / 1000);
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