"use client";

import { useGetTodayQuestionQuery } from "@/data/hooks/useGetTodayQuestionQuery";

export default function QuestionArea() {
  const { data } = useGetTodayQuestionQuery();

  return (
    <section className="border p-8 rounded-2xl space-y-2 text-center bg-secondary">
      <p className="text-sky-500 font-bold">Pergunta do dia • #22</p>
      <h2 className="text-2xl">{data?.text}</h2>
    </section>
  );
}
