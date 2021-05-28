import { PrismaClient } from ".prisma/client";
import ServerWrapper from "./ServerWrapper";
import UserWrapper from "./UserWrapper";

/**
 * Wrapper around the prisma ORM. Usage gives access to the database.
 */
export default class Database {
  private readonly prisma: PrismaClient;
  public readonly server: ServerWrapper;
  public readonly user: UserWrapper;

  constructor() {
    this.prisma = new PrismaClient();
    this.server = new ServerWrapper(this.prisma);
    this.user = new UserWrapper(this.prisma);
  }
}
