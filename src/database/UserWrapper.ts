import { User, Prisma, PrismaClient } from ".prisma/client";

/**
 * Wrapper around the prisma ORM User model.
 * Gives access to CRUD operations and more.
 */
export default class UserWrapper {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new user entry in the database
   * @param  {Prisma.UserCreateInput} userInput Input to create
   * the user entry
   * @returns {User} Created user object
   */
  async create(userInput: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: userInput });
  }

  /**
   * Find a user in the database by an unique identifier
   * @param  {Prisma.UserWhereUniqueInput} userUniquePayload Unique
   * identifier of the user `discordId` or `id`
   * @returns {User | null} `Null` or found user object
   */
  async getUnique(
    userUniquePayload: Prisma.UserWhereUniqueInput
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userUniquePayload });
  }

  /**
   * Find all users in the database limited by the search payload
   * @param  {Prisma.UserWhereInput} userSearchPayload Search input
   * @returns {User[]} Array of users matching the search payload
   */
  async getAll(userSearchPayload: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({ where: userSearchPayload });
  }

  /**
   * Find by unique identifier and update a user entry in the database.
   * Throw `RecordNotFound` exception if user does not exist.
   * @param  {Prisma.UserUpdateArgs} userUpdateArgs Unique identifier
   * and update payload
   * @returns {User} Updated User
   */
  async update(userUpdateArgs: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(userUpdateArgs);
  }
}
