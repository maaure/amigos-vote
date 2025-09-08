"use client";

import { useGetPreviousQuestionsQuery } from "@/data/hooks/useGetPreviousResultsQuery";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import QuestionListLoading from "./loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VotingChart } from "../votingChart";

export default function QuestionsList() {
  const { data: previousQuestions, isPending } = useGetPreviousQuestionsQuery();

  if (isPending) {
    return <QuestionListLoading />;
  }

  return (
    <div className="border rounded space-y-2">
      {previousQuestions?.map((question) => (
        <Dialog key={question.id}>
          <DialogTrigger className="w-full p-4 flex justify-between transition-colors hover:bg-secondary hover:text-sky-500 cursor-pointer">
            <p>
              {formatDate(question.published_when)} - <span className="font-semibold">{question.text}</span>
            </p>
            <ArrowRight />
          </DialogTrigger>
          <DialogContent className="max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Resultados</DialogTitle>
              <DialogDescription>{question.text}</DialogDescription>
            </DialogHeader>

            <VotingChart id={question.id} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
