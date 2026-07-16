import { Skeleton } from "@/components/ui/skeleton";

export default function VotingSectionLoading() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-32 rounded-none" />
        <Skeleton className="h-8 w-56 rounded-none" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton key={idx} className="h-40 w-full rounded-none" />
        ))}
      </div>
    </section>
  );
}
