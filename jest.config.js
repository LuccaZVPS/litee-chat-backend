module.exports = {
  preset: "@shelf/jest-mongodb",
  roots: ["<rootDir>/tests"],
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/tests/**/*.ts", "!src/main/**"],
  coverageDirectory: "coverage",
  testMatch: ["<rootDir>/tests/**/*.(spec).{js,jsx,ts,tsx}"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
