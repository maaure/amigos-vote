"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ClockIcon } from "lucide-react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!timeLeft) {
    <Skeleton className="w-[85px] h-[20px]" />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex gap-2 items-center text-muted-foreground">
          <ClockIcon size="16px" /> {timeLeft}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Para a próxima questão.</p>
      </TooltipContent>
    </Tooltip>
  );
}
