import { db } from "@/db";
import { groupParticipation, groups } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const GroupParticipationRepository = {
  /**
   * Verifica se um usuário já é membro de um grupo.
   */
  isMember: async (groupId: string, friendId: string) => {
    return await db
      .select()
      .from(groupParticipation)
      .where(and(eq(groupParticipation.group, groupId), eq(groupParticipation.user, friendId)));
  },

  /**
   * Adiciona um usuário a um grupo.
   */
  addMember: async (groupId: string, friendId: string) => {
    return await db.insert(groupParticipation).values({ group: groupId, user: friendId });
  },

  /**
   * Retorna todos os grupos que o usuário é membro.
   */
  getGroupsForMember: async (friendId: string) => {
    const participations = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        memberCount: groups.membersCount,
        code: groups.accessCode,
      })
      .from(groupParticipation)
      .innerJoin(groups, eq(groupParticipation.group, groups.id))
      .where(eq(groupParticipation.user, friendId));

    return { groups: participations };
  },
};
