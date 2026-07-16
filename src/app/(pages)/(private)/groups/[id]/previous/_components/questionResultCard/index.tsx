"use client";
import { Calendar, ChevronDown, ChevronUp, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuestionSchemaOut } from "@/types/questions";
import { useGetResultsFromQuestionsQuery } from "@/data/hooks/useGetResultsFromQuestionsQuery";
import { getInitials } from "@/lib/utils";
import Kicker from "@/components/visual/Kicker";

interface QuestionCardProps {
  question: QuestionSchemaOut;
  questionIndex: number;
  totalQuestions: number;
  groupId: string;
}

export default function QuestionResultsCard({
  question,
  questionIndex,
  totalQuestions,
  groupId,
}: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { data, isPending } = useGetResultsFromQuestionsQuery(groupId, question.id, {
    enabled: expanded,
  });

  const handleToggle = () => setExpanded(!expanded);

  return (
    <Card className="overflow-hidden border-2 border-rule bg-paper p-0 py-0 shadow-[4px_4px_0_0_var(--rule)] transition-transform hover:-translate-y-0.5">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-highlight">
            <Calendar className="size-4" />
            <span>
              {new Date(question.publishedWhen).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-rule bg-background/50 px-2 py-1 font-mono text-xs tracking-widest text-muted-foreground">
              #{totalQuestions - questionIndex}
            </span>
            <Button variant="ghost" size="icon" onClick={handleToggle} className="size-8">
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </Button>
          </div>
        </div>

        <blockquote className="masthead text-balance text-xl leading-tight md:text-2xl">
          “{question.text}”
        </blockquote>

        <div className="mt-4 h-[3px] w-16 bg-highlight" />
      </div>

      {expanded && (
        <div className="border-t-2 border-rule bg-background/30 px-6 pb-6 pt-5">
          <div className="mb-4 flex items-center gap-2">
            <Users className="size-4 text-rule" />
            <Kicker className="text-rule">Veredito do júri</Kicker>
          </div>

          {isPending && (
            <div className="py-6 text-center font-mono text-sm uppercase tracking-widest text-muted-foreground">
              Reunindo os votos...
            </div>
          )}
          {data?.results.length === 0 && (
            <div className="py-6 text-center">
              <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                Ninguém votou nesse dia :(
              </span>
            </div>
          )}

          <div className="space-y-2">
            {data?.results.map((result, index) => {
              const percentage =
                result.totalVotes > 0 ? Math.round((result.votes / result.totalVotes) * 100) : 0;
              const isWinner = index === 0;

              return (
                <div
                  key={result.name}
                  className={`relative flex items-center justify-between gap-3 border-2 p-3 ${
                    isWinner ? "border-highlight bg-highlight/5" : "border-rule bg-paper"
                  }`}
                >
                  {isWinner && (
                    <span className="stamp absolute -right-2 -top-3 z-10 px-1.5 py-0.5 text-[0.6rem]">
                      Culpado
                    </span>
                  )}

                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`masthead text-2xl leading-none ${
                        isWinner ? "text-highlight" : "text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>

                    <Avatar
                      className={`size-9 shrink-0 rounded-none border-2 ${
                        isWinner ? "border-highlight" : "border-rule"
                      }`}
                    >
                      <AvatarImage src={result.image} />
                      <AvatarFallback className="rounded-none bg-secondary font-display text-xs">
                        {getInitials(result.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold leading-tight">{result.name}</h3>
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {result.votes} {result.votes === 1 ? "voto" : "votos"}
                      </p>
                    </div>
                    {isWinner && <Trophy className="size-4 shrink-0 text-gold" />}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="hidden h-2 w-24 overflow-hidden border border-rule bg-background sm:block">
                      <div
                        className={`h-full transition-all duration-700 ${
                          isWinner ? "bg-highlight" : "bg-rule"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="font-display text-lg tabular-nums">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
