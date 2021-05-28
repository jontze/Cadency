import { Prisma } from ".prisma/client";
import { Server } from ".prisma/client";
import { PrismaClient } from ".prisma/client";
import ServerWrapper from "./ServerWrapper";

jest.mock(".prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        server: {
          create: jest.fn(() => dummyServer),
          findUnique: jest.fn(() => dummyServer),
          findMany: jest.fn(() => [dummyServer]),
          update: jest.fn(() => dummyServer),
        },
      };
    }),
  };
});

const dummyInputServer: Prisma.ServerCreateInput = {
  name: "test",
  discordId: "1234",
};

const dummyServer: Server = {
  id: 1,
  name: "test",
  discordId: "1212",
  prefix: "!",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ServerWrapper", () => {
  let serverWrapper: ServerWrapper;
  let prismaClient: PrismaClient;

  beforeEach(() => {
    prismaClient = new PrismaClient();
    serverWrapper = new ServerWrapper(prismaClient);
  });

  it("should initiate ServerWrapper class", () => {
    expect(serverWrapper).toBeInstanceOf(ServerWrapper);
  });

  it("should create Server in Database", async () => {
    expect.assertions(6);
    const server = await serverWrapper.create(dummyInputServer);
    expect(server.id).toBe(dummyServer.id);
    expect(server.name).toBe(dummyServer.name);
    expect(server.discordId).toBe(dummyServer.discordId);
    expect(server.prefix).toBe(dummyServer.prefix);
    expect(server.createdAt).toBe(dummyServer.createdAt);
    expect(server.updatedAt).toBe(dummyServer.updatedAt);
  });

  it("should find unique Server in Database", async () => {
    expect.assertions(7);
    const server = await serverWrapper.getUnique({
      discordId: "123",
      id: 1,
    });
    expect(server).toBeTruthy();
    expect(server?.id).toBe(dummyServer.id);
    expect(server?.name).toBe(dummyServer.name);
    expect(server?.discordId).toBe(dummyServer.discordId);
    expect(server?.prefix).toBe(dummyServer.prefix);
    expect(server?.createdAt).toBe(dummyServer.createdAt);
    expect(server?.updatedAt).toBe(dummyServer.updatedAt);
  });

  it("should find multiple Servers in Database", async () => {
    expect.assertions(7);
    const server = await serverWrapper.getAll({ prefix: "!" });
    expect(server.length).toBeGreaterThan(0);
    expect(server[0]?.id).toBe(dummyServer.id);
    expect(server[0]?.name).toBe(dummyServer.name);
    expect(server[0]?.discordId).toBe(dummyServer.discordId);
    expect(server[0]?.prefix).toBe(dummyServer.prefix);
    expect(server[0]?.createdAt).toBe(dummyServer.createdAt);
    expect(server[0]?.updatedAt).toBe(dummyServer.updatedAt);
  });

  it("should find server in Database and update content", async () => {
    expect.assertions(7);
    const server = await serverWrapper.update({
      where: { discordId: "1" },
      data: {
        discordId: "1",
        prefix: "#",
        name: "Name",
      },
    });
    expect(server).toBeTruthy();
    expect(server.id).toBe(dummyServer.id);
    expect(server.name).toBe(dummyServer.name);
    expect(server.discordId).toBe(dummyServer.discordId);
    expect(server.prefix).toBe(dummyServer.prefix);
    expect(server.createdAt).toBe(dummyServer.createdAt);
    expect(server.updatedAt).toBe(dummyServer.updatedAt);
  });
});
