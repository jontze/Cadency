import { User } from ".prisma/client";
import { PrismaClient } from ".prisma/client";
import { Prisma } from ".prisma/client";
import UserWrapper from "./UserWrapper";

jest.mock(".prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        server: {},
        user: {
          create: jest.fn(() => dummyUser),
          findUnique: jest.fn(() => dummyUser),
          findMany: jest.fn(() => [dummyUser]),
          update: jest.fn(() => dummyUser),
        },
      };
    }),
  };
});

const dummyInputUser: Prisma.UserCreateInput = {
  discordId: "1234",
  name: "test",
  server: {
    connect: {
      id: 1,
    },
  },
};

const dummyUser: User = {
  id: 2,
  discordId: "2323",
  name: "test1",
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date(),
  serverId: 1,
};

describe("UserWrapper", () => {
  let userWrapper: UserWrapper;
  let prismaClient: PrismaClient;

  beforeEach(() => {
    prismaClient = new PrismaClient();
    userWrapper = new UserWrapper(prismaClient);
  });

  it("should init", () => {});

  it("should create User in Database", async () => {
    expect.assertions(7);
    const user = await userWrapper.create(dummyInputUser);
    expect(user.id).toBe(dummyUser.id);
    expect(user.name).toBe(dummyUser.name);
    expect(user.discordId).toBe(dummyUser.discordId);
    expect(user.role).toBe(dummyUser.role);
    expect(user.createdAt).toBe(dummyUser.createdAt);
    expect(user.updatedAt).toBe(dummyUser.updatedAt);
    expect(user.serverId).toBe(dummyUser.serverId);
  });

  it("should find unique User in Database", async () => {
    expect.assertions(8);
    const user = await userWrapper.getUnique({ discordId: "123", id: 1 });
    expect(user).toBeTruthy();
    expect(user?.id).toBe(dummyUser.id);
    expect(user?.name).toBe(dummyUser.name);
    expect(user?.discordId).toBe(dummyUser.discordId);
    expect(user?.role).toBe(dummyUser.role);
    expect(user?.createdAt).toBe(dummyUser.createdAt);
    expect(user?.updatedAt).toBe(dummyUser.updatedAt);
    expect(user?.serverId).toBe(dummyUser.serverId);
  });

  it("should find multiple Users in Database", async () => {
    expect.assertions(8);
    const user = await userWrapper.getAll({ name: "test" });
    expect(user.length).toBeGreaterThan(0);
    expect(user[0]?.id).toBe(dummyUser.id);
    expect(user[0]?.name).toBe(dummyUser.name);
    expect(user[0]?.discordId).toBe(dummyUser.discordId);
    expect(user[0]?.role).toBe(dummyUser.role);
    expect(user[0]?.createdAt).toBe(dummyUser.createdAt);
    expect(user[0]?.updatedAt).toBe(dummyUser.updatedAt);
    expect(user[0]?.serverId).toBe(dummyUser.serverId);
  });

  it("should find user in database and update content", async () => {
    expect.assertions(8);
    const user = await userWrapper.update({
      where: { discordId: "1" },
      data: {
        discordId: "1",
        name: "Name",
        role: "MEMBER",
        serverId: 1,
      },
    });
    expect(user).toBeTruthy();
    expect(user.id).toBe(dummyUser.id);
    expect(user.name).toBe(dummyUser.name);
    expect(user.discordId).toBe(dummyUser.discordId);
    expect(user.role).toBe(dummyUser.role);
    expect(user.createdAt).toBe(dummyUser.createdAt);
    expect(user.updatedAt).toBe(dummyUser.updatedAt);
    expect(user.serverId).toBe(dummyUser.serverId);
  });
});
