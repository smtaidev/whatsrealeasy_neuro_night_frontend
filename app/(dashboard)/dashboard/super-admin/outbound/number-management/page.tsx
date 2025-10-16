"use client";

import Button from "@/components/Button";
import FileUpload, { useFormUpload } from "@/components/FileUpload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { env } from "@/env";
import Calendar from "@/features/schedule/components/CalendarSchedule";
import callEndWatcher from "@/features/schedule/components/callEndTime";
import CallLogInfo from "@/features/schedule/components/CallLogInfo";
import { useSchedule } from "@/features/schedule/context/ScheduleContext";
import { cn } from "@/lib/utils";
import { LucideCloudUpload } from "lucide-react";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import OutboundBatchJobsClient from "./_components/OutboundBatchJobs";

interface ServiceIdResponse {
  data?: {
    data?: { serviceId: string }[];
  };
}

export default function NumberManagementPage() {
  callEndWatcher();
  return (
    <div className="space-y-10">
      <HumanFilesManagement />
      <AIFilesManagement />
    </div>
  );
}

function HumanFilesManagement() {
  const { state } = useSchedule();
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();
  const [callNumbers, setCallNumbers] = useState(0);

  useEffect(() => {
    localStorage.getItem("callNumbers" as string) &&
      setCallNumbers(Number(localStorage.getItem("callNumbers" as string)));
  }, []);

  const [formData, setFormData] = useState({
    files: [] as File[],
  });

  const uploadUrl = `https://docs-outbound.advanceaimarketing.cloud/outbound/start-batch-call?starting_time=${state.callStartTime}&call_duration=${state.callDuration}&call_gap=${state.callGap}&total_numbers_in_each_batch=${state.batchNumber}`;

  const { uploadForm, uploading } = useFormUpload({
    url: uploadUrl,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formData.files.length === 0) {
      toast.error("Please select a file");
      return;
    }

    startTransition(async () => {
      toast.success("Uploading...");

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("file", formData.files[0]);

        const res = await fetch("/api/files", {
          method: "POST",
          body: formDataToSend,
        });

        const data = await res.json();

        if (data.success) {
          setCallNumbers(data.count);
          localStorage.setItem("callNumbers", data.count.toString());
          toast.success(`Found ${data.count} numbers`);
        } else {
          toast.error(data.error || "Upload failed");
          return;
        }

        const getServiceId = await fetch(
          `${env.NEXT_PUBLIC_API_BASE_URL}/ai-agents?callType=outbound`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth?.accessToken || "",
            },
          }
        );

        const getServiceIdResponse: ServiceIdResponse =
          await getServiceId.json();

        const serviceId =
          getServiceIdResponse.data?.data?.[0]?.serviceId ?? null;

        const response = await uploadForm({
          serviceId,
          numberfile: formData.files,
        });

        if (response.success) {
          toast.success("Successful");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload file");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        disabled={isPending}
        className={cn(isPending && "opacity-50 cursor-progress")}
      >
        <div className="bg-dark2 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 border-b border-gray-700 mb-6 pb-6">
            <div className="flex gap-2 items-center">
              <LucideCloudUpload size={32} />
              <div className="">
                <h2 className="text-sm">Upload Phone Numbers files</h2>
                <h3 className="text-xs">
                  Select and upload the files of your choice
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end relative gap-4">
              <OutboundBatchJobsClient />
              <CallLogInfo
                total_number_call_started={callNumbers}
                call_duration={state.callDuration}
              />
              <Calendar />
            </div>
            <FileUpload
              onFilesChange={(files) => setFormData({ ...formData, files })}
              disabled={uploading}
              onUploadSuccess={() =>
                toast.success("File uploaded successfully!")
              }
              onUploadError={(error) => toast.error(error.message)}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />

            <div className="flex justify-center">
              <Button className="px-10" size="sm">
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

function AIFilesManagement() {
  const auth = useAuth();
  const [isPending, startTransition] = useTransition();
  const { uploadForm, uploading } = useFormUpload({
    url: `${env.NEXT_PUBLIC_API_BASE_URL_AI_INBOUND}/service-knowledge/knowledge-base/file`,
    onSuccess: () => toast.success("File uploaded successfully!"),
    onError: (error) => toast.error(error.message),
  });
  const [firstMessage, setFirstMessage] = useState("");

  const [formData, setFormData] = useState({
    files: [] as File[],
  });

  const handleServiceId = async () => {
    const getServiceId = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/ai-agents?callType=outbound`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth?.accessToken || "",
        },
      }
    );
    const getServiceIdResponse: ServiceIdResponse = await getServiceId.json();
    const serviceId = getServiceIdResponse.data?.data?.[0]?.serviceId ?? null;
    return serviceId;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formData.files.length === 0) {
      toast.error("Please select a file");
      return;
    }

    toast.success("Uploading...");

    startTransition(async () => {
      try {
        // --- Get serviceId ---
        const serviceId = await handleServiceId();

        // --- Upload form data ---
        await uploadForm({
          serviceId,
          file: formData.files,
        });

        // --- Create/update agent ---
        const updateAgent = await fetch(
          `${env.NEXT_PUBLIC_API_BASE_URL_AI_INBOUND}/services/create-agent/?service_id=${serviceId}&call_type=outbound`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_message: firstMessage,
              max_duration_seconds: 240,
              stability: 0.9,
              speed: 0.9,
              similarity_boost: 0.7,
              llm: "gemini-2.0-flash-lite",
              temperature: 0.9,
              daily_limit: 1000,
            }),
          }
        );

        await updateAgent.json();

        toast.success("Agent created successfully!");
      } catch (err) {
        console.error("Error during handleSubmit:", err);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <>
      <div className="flex gap-2 items-center border-b border-gray-700 mb-6 pb-6">
        <LucideCloudUpload size={32} />
        <div className="">
          <h2 className="text-sm">AI Guide Document</h2>
          <h3 className="text-xs">
            Select and upload the files of your choice
          </h3>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <fieldset
          disabled={isPending}
          className={cn(isPending && "opacity-50 cursor-progress")}
        >
          <div className="space-y-2 mb-4">
            <Label>Greetings Message</Label>
            <Textarea
              onChange={(e) => setFirstMessage(e.target.value)}
              placeholder="First message"
            />
          </div>
          <FileUpload
            onFilesChange={(files) => setFormData({ ...formData, files })}
            disabled={uploading}
            onUploadSuccess={() => toast.success("File uploaded successfully!")}
            onUploadError={(error) => toast.error(error.message)}
            accept=".txt,text/plain"
          />
          <div className="flex justify-center mt-4">
            <Button disabled={isPending} size="sm">
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </fieldset>
      </form>
    </>
  );
}
