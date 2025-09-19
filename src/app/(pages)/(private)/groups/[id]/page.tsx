"use client";
import { Button } from "@/components/ui/button";
import VotingSection from "@/app/(pages)/(private)/groups/[id]/_components/VotingSection";
import { Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import Timer from "./_components/Timer";
import QuestionArea from "./_components/QuestionArea";
import Header from "./_components/Header";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />

        <div className="flex justify-between items-center mx-4">
          <Link href={`/groups/${id}/previous`}>
            <Button variant="outline">
              <Calendar /> Ver Últimos Resultados
            </Button>
          </Link>
          <Timer />
        </div>

        <QuestionArea groupId={id as string} />

        <VotingSection groupId={id as string} />
      </div>
    </div>
  );
}
