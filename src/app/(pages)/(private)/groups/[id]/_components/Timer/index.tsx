"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Hourglass } from "lucide-react";
import { useEffect, useState } from "react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState<string>();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      const tomorrowUTC = new Date(now);
      tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);
      tomorrowUTC.setUTCHours(0, 0, 0, 0);

      const diff = tomorrowUTC.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return <Skeleton className="h-8 w-28 rounded-none" />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center gap-2 border-2 border-rule bg-paper px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-widest">
          <Hourglass className="size-4 animate-tick text-highlight" />
          {timeLeft}
        </span>
      </TooltipTrigger>
      <TooltipContent>Até a próxima acusação.</TooltipContent>
    </Tooltip>
  );
}
