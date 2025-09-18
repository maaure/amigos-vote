import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import { FriendsRepository } from "@/db/repositories/friends.repository";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const [existing] = await FriendsRepository.findByGithubId({ id: user.id! });

      if (!existing) {
        await FriendsRepository.create({
          name: user.name!,
          urlPic: user.image!,
          githubId: user.id!,
        });
      }
      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        const [friend] = await FriendsRepository.findByGithubId({ id: user.id! });
        if (friend) {
          token.friend = {
            id: friend.id,
            name: friend.name,
            urlPic: friend.urlPic,
            githubId: friend.githubId,
          };
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.friend) {
        session.user = token.friend;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
