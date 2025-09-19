"use client";
import { Calendar, ChevronDown, ChevronUp, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuestionSchemaOut } from "@/types/questions";
import { useGetResultsFromQuestionsQuery } from "@/data/hooks/useGetResultsFromQuestionsQuery";
import { getInitials } from "@/lib/utils";

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

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="bg-card border-border shadow-card py-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-highlight/80 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(question.publishedWhen).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              #{totalQuestions - questionIndex}
            </span>
            <Button variant="ghost" size="sm" onClick={handleToggle} className="h-8 w-8 p-0">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-4">
          {question.text}
        </h2>

        <div className="w-12 h-0.5 bg-highlight rounded-full"></div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-foreground mb-4">
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm">Resultados da Votação</span>
            </div>

            {isPending && (
              <div className="text-center text-muted-foreground py-4">Carregando resultados...</div>
            )}
            {data?.results.length === 0 && (
              <span className="text-muted-foreground text-center">
                Não houve votos nesse dia :(
              </span>
            )}
            {data?.results.map((result, index) => {
              const percentage =
                result.totalVotes > 0 ? Math.round((result.votes / result.totalVotes) * 100) : 0;

              return (
                <div
                  key={result.name}
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary min-w-[24px]">
                        #{index + 1}
                      </span>
                      {index === 0 && <Trophy className="w-4 h-4 text-highlight" />}
                    </div>

                    <Avatar className="w-8 h-8">
                      <AvatarImage src={result.image} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                        {getInitials(result.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-medium text-foreground">{result.name}</h3>
                      <p className="text-xs text-muted-foreground">{result.votes} votos</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-primary min-w-[40px] text-right">
                      {percentage}%
                    </span>
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
