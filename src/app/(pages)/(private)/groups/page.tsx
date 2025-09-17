"use client";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import Header from "./[id]/_components/Header";
import { useGetGroupsQuery } from "@/data/hooks/useGetGroupsQuery";
import GroupCard from "./_components/GroupCard";
import EmptyGroupList from "./_components/EmptyGroupList";
import { Skeleton } from "@/components/ui/skeleton";

const Groups = () => {
  const { data, isPending } = useGetGroupsQuery();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/groups/new" className="block">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Criar Novo Grupo</span>
            </Button>
          </Link>
          <Link href="/groups/join" className="block">
            <Button variant="outline" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Entrar em Grupo</span>
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Meus Grupos</h2>

          {isPending && (
            <>
              <Skeleton className="w-[896px] h-[190px]" />
              <Skeleton className="w-[896px] h-[190px]" />
              <Skeleton className="w-[896px] h-[190px]" />
            </>
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
        </div>
      </div>
    </div>
  );
};

export default Groups;
