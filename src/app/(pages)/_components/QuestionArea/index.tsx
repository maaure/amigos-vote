"use client";

import { useGetTodayQuestionQuery } from "@/data/hooks/useGetTodayQuestionQuery";
import QuestionAreaLoading from "./loading";

export default function QuestionArea() {
  const { data, isPending } = useGetTodayQuestionQuery();

  if (isPending) {
    return <QuestionAreaLoading />;
  }

  return (
    <section className="border p-8 rounded-2xl space-y-2 text-center mx-4">
      <p className="text-sky-500 font-bold">Pergunta do dia</p>
      <h2 className="text-2xl">{data?.text}</h2>
    </section>
  );
}
