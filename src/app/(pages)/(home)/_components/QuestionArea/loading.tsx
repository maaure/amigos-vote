import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionAreaLoading() {
  return (
    <>
      <section className="border p-8 rounded-2xl space-y-2">
        <Skeleton className="w-[130px] h-[20px] mx-auto" />
        <Skeleton className="w-[730px] h-[30px] mx-auto" />
      </section>
    </>
  );
}
