/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  collectCoverage: true,
  coverageReporters: ["text", "cobertura"],
};
