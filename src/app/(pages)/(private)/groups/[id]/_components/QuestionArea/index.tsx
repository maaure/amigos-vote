"use client";

import { useGetTodayQuestionQuery } from "@/data/hooks/useGetTodayQuestionQuery";
import QuestionAreaLoading from "./loading";

interface IQuestionArea {
  groupId: string;
}

export default function QuestionArea({ groupId }: IQuestionArea) {
  const { data: todayQuestion, isPending } = useGetTodayQuestionQuery(groupId);

  if (isPending) {
    return <QuestionAreaLoading />;
  }

  return (
    <section className="border border-border p-8 rounded-2xl space-y-3 flex flex-col items-center">
      <p className="text-highlight font-semibold ">Pergunta do dia</p>
      <h2 className="text-2xl text-center">{todayQuestion?.data?.text}</h2>
      <div className="w-12 h-0.5 bg-highlight rounded-full"></div>
    </section>
  );
}
