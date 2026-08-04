"use client";
import { Button } from "@/components/ui/button";
import VotingSection from "@/app/(pages)/(private)/groups/[id]/_components/VotingSection";
import { Archive, Share2 } from "lucide-react";
import Link from "next/link";
import Timer from "./_components/Timer";
import QuestionArea from "./_components/QuestionArea";
import Header from "./_components/Header";
import PageShell from "@/components/layout/PageShell";
import { useParams } from "next/navigation";
import { useGetGroupsQuery } from "@/data/hooks/useGetGroupsQuery";

export default function Home() {
  const params = useParams();
  const id = params?.id as string;
  const { data: groups } = useGetGroupsQuery();
  const group = groups?.find((g) => g.id === id);

  return (
    <PageShell width="default">
      <Header />

      <div
        className="reveal flex flex-wrap items-center justify-between gap-3"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/groups/${id}/previous`}>
            <Button variant="outline">
              <Archive className="size-4" />
              Arquivo de vereditos
            </Button>
          </Link>
          {group && (
            <Link
              href={`/groups/created?accessCode=${group.accessCode}&groupName=${encodeURIComponent(group.name)}`}
            >
              <Button variant="outline">
                <Share2 className="size-4" />
                Compartilhar código
              </Button>
            </Link>
          )}
        </div>
        <Timer />
      </div>

      <QuestionArea groupId={id} />

      <VotingSection groupId={id} />
    </PageShell>
  );
}
