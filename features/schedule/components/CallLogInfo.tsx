"use client";

import Button from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CallLogInfoProps = {
  total_number_call_started: number;
  call_duration: number; // in seconds
};

export default function CallLogInfo({
  total_number_call_started,
  call_duration,
}: CallLogInfoProps) {
  const elevenLabsCostPerMin = 0.14;
  const twilioCostPerMin = 0.013;

  // ✅ Convert seconds → minutes
  const callDurationInMin = call_duration / 60;

  // ✅ Correct total cost calculation
  const totalCost =
    (elevenLabsCostPerMin + twilioCostPerMin) *
    total_number_call_started *
    callDurationInMin;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">See running calls summary info</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-slate-900 text-slate-100 border border-slate-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-slate-100">
            A total of {total_number_call_started} call
            {total_number_call_started > 1 ? "s have" : " has"} been started.
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            The price breakdown of call cost is below:
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm list-disc list-inside">
          <li>
            Per minute cost of ElevenLabs is <strong>$0.14</strong>
          </li>
          <li>
            Per minute cost of Twilio is <strong>$0.013</strong>
          </li>
          <li>
            Total cost calculation formula ~{" "}
            <strong>
              (0.14 + 0.013) × Total_Calls ({total_number_call_started}) ×
              Call_Duration ({callDurationInMin.toFixed(2)} min)
            </strong>
          </li>
        </ul>
        <div>
          Total cost: <strong>${totalCost.toFixed(2)}</strong>
        </div>
        <div className="text-sm">
          <strong>Note:</strong>{" "}
          <span className="text-white/80">
            The call cost is an approximation. It will be the same only if all
            calls are received and last for the full call duration. The cost
            will decrease if calls are not answered or conversation time is
            shorter.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
