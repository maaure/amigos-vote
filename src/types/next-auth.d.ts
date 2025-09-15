import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      urlPic: string | null;
      githubId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    friend?: {
      id: string;
      name: string;
      urlPic: string | null;
      githubId: string | null;
    };
  }
}
