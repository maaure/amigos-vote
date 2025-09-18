import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";
import { GroupParticipationRepository } from "@/db/repositories/groupParticipation.repository";
import { redirect } from "next/navigation";
import NotFound from "./not-found";

interface GroupLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function GroupLayout({ children, params }: Readonly<GroupLayoutProps>) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/");
  }

  const { id: groupId } = await params;

  const isMember = await GroupParticipationRepository.isMember(groupId, session.user.id);

  if (!isMember) {
    return <NotFound />;
  }

  return children;
}
