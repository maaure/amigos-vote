import { db } from "@/db";
import { groupParticipation, groups } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

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
      .select()
      .from(groupParticipation)
      .where(eq(groupParticipation.user, friendId));
    const groupIds = participations.map((p) => p.group).filter(Boolean) as string[];
    if (groupIds.length === 0) return [];
    return await db.select().from(groups).where(inArray(groups.id, groupIds));
  },
};
