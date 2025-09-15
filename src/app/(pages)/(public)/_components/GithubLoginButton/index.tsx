"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

export default function GitHubLoginButton() {
  return (
    <Button
      size="lg"
      onClick={() => signIn("github")}
      className="flex items-center space-x-3 px-8 py-4 text-lg mx-auto"
    >
      <Github className="w-6 h-6" />
      <span>Entrar com GitHub</span>
    </Button>
  );
}
