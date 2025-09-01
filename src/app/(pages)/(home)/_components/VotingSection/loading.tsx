import { Skeleton } from "@/components/ui/skeleton";

export default function VotingSectionLoading() {
  return (
    <>
      <section className="space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-[200px] h-[24px]" />
          <Skeleton className="w-[120px] h-[20px]" />
        </div>

        <div className="gap-4 grid grid-cols-4">
          {Array.from({ length: 20 }).map((_, idx) => (
            <Skeleton key={idx} className="w-[212px] h-[162px]" />
          ))}
        </div>
      </section>
    </>
  );
}
