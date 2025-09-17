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

interface IQuestionsListProps {
  groupId: string;
}

export default function QuestionsList({ groupId }: IQuestionsListProps) {
  const { data: previousQuestions, isPending } = useGetPreviousQuestionsQuery(groupId);

  if (isPending) {
    return <QuestionListLoading />;
  }

  return (
    <div className="border border-border rounded space-y-2">
      {previousQuestions?.map((question) => (
        <Dialog key={question.id}>
          <DialogTrigger className="w-full p-4 flex justify-between transition-colors hover:bg-secondary hover:text-sky-500 cursor-pointer">
            <p>
              {formatDate(question.publishedWhen)} -{" "}
              <span className="font-semibold">{question.text}</span>
            </p>
            <ArrowRight />
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] min-w-fit">
            <DialogHeader>
              <DialogTitle>Resultados</DialogTitle>
              <DialogDescription>{question.text}</DialogDescription>
            </DialogHeader>

            <VotingChart questionId={question.id} groupId={groupId} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
