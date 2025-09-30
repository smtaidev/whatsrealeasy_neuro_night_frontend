"use client";

import Button from "@/components/Button";
import FileUpload, { useFormUpload } from "@/components/FileUpload";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { env } from "@/env";
import Calendar from "@/features/schedule/components/CalendarSchedule";
import { useSchedule } from "@/features/schedule/context/ScheduleContext";
import { LucideCloudUpload } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface ServiceIdResponse {
  data?: {
    data?: { serviceId: string }[];
  };
}

export default function NumberManagementPage() {
  return (
    <div className="space-y-10">
      <HumanFilesManagement />
      <AIFilesManagement />
      <DirectCallManagement />
    </div>
  );
}

function HumanFilesManagement() {
  const { state } = useSchedule();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    files: [] as File[],
  });

  const { uploadForm, uploading, progress } = useFormUpload({
    url: `${env.NEXT_PUBLIC_API_BASE_URL_AI_OUTBOUND}/outbound/start-batch-call?starting_time=${state.callStartTime}&call_duration=${state.callDuration}&call_gap=${state.callGap}&total_numbers_in_each_batch=${state.batchNumber}`,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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

    await uploadForm({
      serviceId,
      numberfile: formData.files,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
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
          <div className="flex items-center justify-end relative">
            <Calendar />
          </div>
          <FileUpload
            onFilesChange={(files) => setFormData({ ...formData, files })}
            disabled={uploading}
            onUploadSuccess={() => toast.success("File uploaded successfully!")}
            onUploadError={(error) => toast.error(error.message)}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />

          <div className="flex justify-center">
            <Button className="px-10" size="sm">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function AIFilesManagement() {
  const auth = useAuth();
  const { uploadForm, uploading, progress } = useFormUpload({
    url: `${env.NEXT_PUBLIC_API_BASE_URL_AI_INBOUND}/service-knowledge/knowledge-base/file`,
  });

  const [formData, setFormData] = useState({
    files: [] as File[],
  });

  const handleServiceId = async () => {
    const getServiceId = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/ai-agents`,
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const serviceId = await handleServiceId();

    await uploadForm({
      serviceId: serviceId,
      file: formData.files,
    });

    const updateAgent = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL_AI_INBOUND}/services/create-agent/?service_id=${serviceId}&call_type=outbound`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_message: "Hi, I am Mehedi from Advance AI marketing",
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

    const updateAgentResponse = await updateAgent.json();
    console.log({ updateAgentResponse });
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
        <FileUpload
          onFilesChange={(files) => setFormData({ ...formData, files })}
          disabled={uploading}
          onUploadSuccess={() => toast.success("File uploaded successfully!")}
          onUploadError={(error) => toast.error(error.message)}
          accept=".txt,text/plain"
        />
        <div className="flex justify-center mt-4">
          <Button size="sm">Upload</Button>
        </div>
      </form>
    </>
  );
}

function DirectCallManagement() {
  return (
    <div className="w-fit mx-auto">
      <span className="text-lg mb-2">Write a single number</span>
      <Input className="w-72" placeholder="(270) 555-0117" />
      <Button className="mt-4 w-full" size="sm">
        Call Now
      </Button>
    </div>
  );
}

function UploadProgress() {}
