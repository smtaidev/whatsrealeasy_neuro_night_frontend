import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const pageLimits = ["5", "10", "15", "20"];

export default function PageLimits() {
  const searchParams = new URLSearchParams(useSearchParams());
  const router = useRouter();

  const handlePageLimitChange = (limit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit);

    const url = `?${params.toString()}`;

    router.push(url);
  };

  return (
    <Select onValueChange={handlePageLimitChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Page Limit" />
      </SelectTrigger>
      <SelectContent>
        {pageLimits.map((limit) => (
          <SelectItem key={limit} value={limit}>
            {limit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
