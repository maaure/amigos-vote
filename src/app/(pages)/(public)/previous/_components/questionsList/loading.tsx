import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionListLoading() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 20 }).map((_, idx) => (
        <Skeleton className="w-full h-[56px]" key={idx} />
      ))}
    </div>
  );
}
