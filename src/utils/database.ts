import { Server } from ".prisma/client";
import { DEFAULT_PREFIX } from "../cadency/constants/Cadency.constants";
import Database from "../database/Database";

/**
 * Get the prefix used on the given server or returns the default
 * prefix if not specified
 * @param  {string} guildId Server unique identifier
 * @param  {Database} db Database class with connection
 * @returns {string} Server prefix in database or default prefix
 */
export const getPrefix = async (
  guildId: string,
  db: Database
): Promise<string> => {
  return (
    (await db.server.getUnique({ discordId: guildId }))?.prefix ??
    DEFAULT_PREFIX
  );
};

/**
 * Update the prefix of a existing server or creates a server
 * in the database and set the new prefix
 * @param  {string} guildId Discord server id
 * @param  {Database} db Database class with connection
 * @param  {string[]} args Arguments containing new prefix
 * @param  {string} guildName? Discord Server name
 * @returns Promise Updated or new creates Server with prefix
 */
export const updatePrefixOfServer = async (
  guildId: string,
  db: Database,
  args: string[],
  guildName?: string
): Promise<Server> => {
  const oldServer = await db.server.getUnique({ discordId: guildId });
  if (oldServer == null) {
    return db.server.create({
      discordId: guildId,
      name: guildName,
      prefix: args[0],
    });
  }
  return db.server.update({
    where: {
      discordId: guildId,
    },
    data: {
      prefix: args[0],
    },
  });
};
