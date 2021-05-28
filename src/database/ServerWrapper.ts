import { Server, Prisma, PrismaClient } from ".prisma/client";

/**
 * Wrapper arount the prisma ORM Server model.
 * Gives access to CRUD operations and more.
 */
export default class ServerWrapper {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new server entry in the database
   * @param  {Prisma.ServerCreateInput} serverInput Input to create
   * the server entry
   * @returns {Server} Created server object
   */
  async create(serverInput: Prisma.ServerCreateInput): Promise<Server> {
    return this.prisma.server.create({ data: serverInput });
  }

  /**
   * Find a server in the database by an unique identifier
   * @param serverUniquePayload Unique identifier of the server
   * `discordId` or `id`
   * @returns {Server | null} `Null` or found server object
   */
  async getUnique(
    serverUniquePayload: Prisma.ServerWhereUniqueInput
  ): Promise<Server | null> {
    return this.prisma.server.findUnique({ where: serverUniquePayload });
  }

  /**
   * Find all servers in the database limited by the search payload
   * @param  {Prisma.ServerWhereInput} serverSearchPayload Search input
   * @returns {Server[]} Array of servers matching the search payload
   */
  async getAll(
    serverSearchPayload: Prisma.ServerWhereInput
  ): Promise<Server[]> {
    return this.prisma.server.findMany({ where: serverSearchPayload });
  }

  /**
   * Find by unique identifier and update a server entry in the database.
   * Throw `RecordNotFound` exception if server does not exist.
   * @param {Prisma.ServerUpdateArgs} serverUpdateArgs Unique identifier
   * and update payload
   * @returns {Server} Updated Server
   */
  async update(serverUpdateArgs: Prisma.ServerUpdateArgs): Promise<Server> {
    return this.prisma.server.update(serverUpdateArgs);
  }
}
