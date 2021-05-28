import Database from "./Database";
import ServerWrapper from "./ServerWrapper";
import UserWrapper from "./UserWrapper";

// Required to prevent that the prisma client tries to
//  connect to the database
jest.mock(".prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

describe("Database", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database();
  });

  it("should initiate database class", () => {
    expect(db).toBeInstanceOf(Database);
    expect(db).toBeDefined();
  });

  it("should has public server property", () => {
    expect(db.server).toBeInstanceOf(ServerWrapper);
    expect(db.server).toBeDefined();
  });

  it("should has public user property", () => {
    expect(db.user).toBeInstanceOf(UserWrapper);
    expect(db.user).toBeDefined();
  });
});
