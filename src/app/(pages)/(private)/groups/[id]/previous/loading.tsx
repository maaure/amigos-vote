import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionListLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Skeleton key={idx} className="h-28 w-full rounded-none" />
      ))}
    </div>
  );
}
