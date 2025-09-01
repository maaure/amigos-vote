"use client";
import { useGetPreviousQuestionsQuery } from "@/data/hooks/useGetPreviousResultsQuery";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function Previous() {
  const { data: previousQuestions, isPending } = useGetPreviousQuestionsQuery();

  return (
    <div className="max-w-4xl m-auto space-y-8">
      <header className="w-full relative flex justify-center items-center p-4">
        <Link href={"/"} className="absolute left-4">
          <ArrowLeft />
        </Link>

        <div className="flex items-center justify-center gap-4 text-sky-500">
          <Calendar />
          <h1 className="text-4xl text-center font-bold">Resultados anteriores</h1>
        </div>
      </header>

      <div className="border rounded space-y-2">
        {previousQuestions?.map((question) => (
          <div
            className="w-full p-4 flex justify-between transition-colors hover:bg-secondary cursor-pointer"
            key={question.id}
          >
            <p>
              {formatDate(question.day)} - <span className="font-semibold">{question.text}</span>
            </p>
            <ArrowRight />
          </div>
        ))}
      </div>
    </div>
  );
}
