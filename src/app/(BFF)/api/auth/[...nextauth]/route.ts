import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { FriendsRepository } from "@/db/repositories/friends.repository";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const [existing] = await FriendsRepository.findByGoogleId({ id: user.id! });

      if (!existing) {
        await FriendsRepository.create({
          name: user.name!,
          urlPic: user.image!,
          googleId: user.id!,
        });
      }
      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        const [friend] = await FriendsRepository.findByGoogleId({ id: user.id! });
        if (friend) {
          token.friend = {
            id: friend.id,
            name: friend.name,
            urlPic: friend.urlPic,
            googleId: friend.googleId,
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
