import { Server } from ".prisma/client";
import { DEFAULT_PREFIX } from "../cadency/constants/Cadency.constants";
import Database from "../database/Database";
import { getPrefix, updatePrefixOfServer } from "./database";

const mockGetUniqueServer = jest.fn();
const mockUpdateServer = jest.fn();
const mockCreateServer = jest.fn();

jest.mock("../database/Database", () =>
  jest.fn().mockImplementation(() => {
    return {
      server: {
        getUnique: mockGetUniqueServer,
        create: mockCreateServer,
        update: mockUpdateServer,
      },
    };
  })
);

describe("Database utils", () => {
  let db: Database;

  beforeEach(() => {
    jest.clearAllMocks();
    db = new Database();
  });

  it("should get default prefix of server if server empty", async () => {
    expect.assertions(2);
    const dummyGuildId = "guidId";
    const newPrefix = await getPrefix(dummyGuildId, db);
    expect(db.server.getUnique).toHaveBeenCalledWith({
      discordId: dummyGuildId,
    });
    expect(newPrefix).toBe(DEFAULT_PREFIX);
  });

  it("should get prefix of server", async () => {
    expect.assertions(2);
    mockGetUniqueServer.mockResolvedValue({ prefix: "#" });
    const dummyGuildId = "guidId";
    const newPrefix = await getPrefix(dummyGuildId, db);
    expect(db.server.getUnique).toHaveBeenCalledWith({
      discordId: dummyGuildId,
    });
    expect(newPrefix).toBe("#");
  });

  it("should update prefix if server exists", async () => {
    expect.assertions(4);
    const dummyServer = "dummyServer" as unknown as Server;
    mockGetUniqueServer.mockResolvedValue(dummyServer);
    mockUpdateServer.mockResolvedValue(dummyServer);
    const updatedServer = await updatePrefixOfServer("", db, ["#"]);
    expect(mockGetUniqueServer).toHaveBeenCalledWith({ discordId: "" });
    expect(mockUpdateServer).toHaveBeenCalledWith({
      where: {
        discordId: "",
      },
      data: {
        prefix: "#",
      },
    });
    expect(updatedServer).toBeDefined();
    expect(updatedServer).toBe(dummyServer);
  });

  it("should create new server with new prefix if server not exist", async () => {
    expect.assertions(4);
    const dummyServer = "dummyServer" as unknown as Server;
    mockGetUniqueServer.mockResolvedValue(null);
    mockCreateServer.mockResolvedValue(dummyServer);
    const updatedServer = await updatePrefixOfServer("", db, ["#"]);
    expect(mockGetUniqueServer).toHaveBeenCalledWith({ discordId: "" });
    expect(mockCreateServer).toHaveBeenCalledWith({
      discordId: "",
      prefix: "#",
      name: undefined,
    });
    expect(updatedServer).toBeDefined();
    expect(updatedServer).toBe(dummyServer);
  });
});
