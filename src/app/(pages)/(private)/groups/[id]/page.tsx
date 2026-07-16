"use client";
import { Button } from "@/components/ui/button";
import VotingSection from "@/app/(pages)/(private)/groups/[id]/_components/VotingSection";
import { Archive } from "lucide-react";
import Link from "next/link";
import Timer from "./_components/Timer";
import QuestionArea from "./_components/QuestionArea";
import Header from "./_components/Header";
import PageShell from "@/components/layout/PageShell";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <PageShell width="default">
      <Header />

      <div
        className="reveal flex flex-wrap items-center justify-between gap-3"
        style={{ animationDelay: "60ms" }}
      >
        <Link href={`/groups/${id}/previous`}>
          <Button variant="outline">
            <Archive className="size-4" />
            Arquivo de vereditos
          </Button>
        </Link>
        <Timer />
      </div>

      <QuestionArea groupId={id} />

      <VotingSection groupId={id} />
    </PageShell>
  );
}
