"use client";

import { useGetTodayQuestionQuery } from "@/data/hooks/useGetTodayQuestionQuery";
import Kicker from "@/components/visual/Kicker";
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
    <section className="reveal poster-frame relative overflow-hidden bg-paper px-6 py-10 text-center paper-grain">
      <div className="halftone-highlight pointer-events-none absolute inset-0 opacity-[0.08]" />
      <div className="relative space-y-4">
        <Kicker>Acusação do dia</Kicker>
        <blockquote className="masthead mx-auto max-w-3xl text-balance text-3xl leading-[1] sm:text-4xl md:text-5xl">
          “{todayQuestion?.data?.text}”
        </blockquote>
        <div className="mx-auto flex w-24 items-center gap-2">
          <span className="h-[3px] flex-1 bg-highlight" />
          <span className="size-2 rotate-45 bg-highlight" />
          <span className="h-[3px] flex-1 bg-highlight" />
        </div>
      </div>
    </section>
  );
}
