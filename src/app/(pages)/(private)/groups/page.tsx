"use client";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import Header from "./[id]/_components/Header";
import { useGetGroupsQuery } from "@/data/hooks/useGetGroupsQuery";
import GroupCard from "./_components/GroupCard";
import EmptyGroupList from "./_components/EmptyGroupList";
import { Skeleton } from "@/components/ui/skeleton";
import PageShell from "@/components/layout/PageShell";

const Groups = () => {
  const { data, isPending } = useGetGroupsQuery();

  return (
    <PageShell width="default">
      <Header />

      <div className="reveal flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "60ms" }}>
        <Link href="/groups/new" className="block">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="size-4" />
            Abrir novo tribunal
          </Button>
        </Link>
        <Link href="/groups/join" className="block">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Users className="size-4" />
            Entrar com código
          </Button>
        </Link>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="masthead text-2xl">Boletim de processos</h2>
          <span className="h-[3px] flex-1 bg-rule" />
        </div>

        {isPending && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-none" />
            ))}
          </div>
        )}

        {data?.length === 0 ? (
          <EmptyGroupList />
        ) : (
          <div className="grid gap-4">
            {data?.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default Groups;
