import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionAreaLoading() {
  return (
    <section className="poster-frame bg-paper px-6 py-10">
      <div className="space-y-3">
        <Skeleton className="mx-auto h-4 w-32 rounded-none" />
        <Skeleton className="mx-auto h-10 w-3/4 rounded-none" />
      </div>
    </section>
  );
}
