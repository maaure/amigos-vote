"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();

  if (status === "loading") return <>Loading...</>;
  if (status === "unauthenticated") redirect("/");

  return children;
}
