"use client";
import { LabelList, Pie, PieChart, Sector } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { useGetResultsFromQuestionsQuery } from "@/data/hooks/useGetResultsFromQuestionsQuery";
import { Skeleton } from "@/components/ui/skeleton";

interface VotingChartProps {
  questionId: string;
  groupId: string;
}

export function VotingChart({ groupId, questionId }: VotingChartProps) {
  const { data, isPending } = useGetResultsFromQuestionsQuery(groupId, questionId);

  if (isPending) {
    return (
      <div className="mx-auto aspect-square min-h-[400px]">
        <Skeleton className="h-full rounded-full" />
      </div>
    );
  }

  if (data?.results.length === 0) {
    return "Nenhum voto foi feito nesse dia :(";
  }

  const results =
    data?.results?.map((item, idx) => ({
      ...item,
      fill: `var(--chart-${idx < 10 ? (idx % 10) + 1 : 10})`,
    })) ?? [];

  const chartConfig: ChartConfig = {};

  results.forEach((item) => {
    chartConfig[item.name] = {
      label: item.name,
      color: item.fill,
    };
  });

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square lg:min-h-[500px] min-h-[80vw]"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="votes" hideLabel />} />
        <Pie
          data={results}
          dataKey="votes"
          nameKey="friend"
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
          animationDuration={250}
        >
          <LabelList
            dataKey="friend"
            position="insideTop"
            offset={8}
            className="fill-foreground"
            fontSize={12}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
