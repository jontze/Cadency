module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec).ts?(x)"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/main.ts"],
  coveragePathIgnorePatterns: ["node_modules", "typings", "logger", "errors"],
};
