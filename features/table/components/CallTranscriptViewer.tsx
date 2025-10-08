"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type CallTranscriptProps = {
  content: string | null;
};

export function CallTranscript({ content }: CallTranscriptProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">View Transcript</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl">Call Transcript</DialogTitle>
          <DialogDescription className="text-white/80">
            {content
              ? "Conversation details are shown below."
              : "No transcript available."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] rounded-md border p-4 bg-slate-800 text-white">
          {content ? (
            <p className="whitespace-pre-wrap text-base">{content}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Transcript is empty.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
