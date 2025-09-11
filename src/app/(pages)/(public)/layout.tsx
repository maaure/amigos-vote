"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();

  console.log(status);
  if (status === "loading") return <>Loading...</>;
  if (status === "authenticated") redirect("/groups");

  return children;
}
