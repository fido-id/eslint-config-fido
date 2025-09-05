const { tester } = require("../../tester");
const rule = require("../../../src/lib/rules/no-explicit-as");

tester.run("no-explicit-as", rule, {
  valid: [
    { code: `const x: number = 5;` },
    {
      code: `function isString(val: unknown): val is string { return typeof val === "string"; }`,
    },
  ],
  invalid: [
    {
      code: `const value = foo as string;`,
      errors: [{ messageId: "noExplicitAs" }],
    },
    {
      code: `const num = something as number;`,
      errors: [{ messageId: "noExplicitAs" }],
    },
  ],
});
