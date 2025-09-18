"use client";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();

  if (status === "loading")
    return (
      <div className="flex min-w-screen min-h-screen items-center justify-center">
        <Spinner variant="ring" />
      </div>
    );
  if (status === "unauthenticated") redirect("/");

  return children;
}
