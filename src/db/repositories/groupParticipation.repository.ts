import { db } from "@/db";
import { groupParticipation, groups } from "@/db/schema";
import { GroupSchemaOut } from "@/types/groups";
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
  getGroupsForMember: async (friendId: string): Promise<GroupSchemaOut[]> => {
    return await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        membersCount: groups.membersCount,
        accessCode: groups.accessCode,
        createdAt: groups.createdAt,
        createdBy: groups.createdBy,
      })
      .from(groupParticipation)
      .innerJoin(groups, eq(groupParticipation.group, groups.id))
      .where(eq(groupParticipation.user, friendId));
  },
};
