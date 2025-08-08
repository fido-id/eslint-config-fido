const { RuleTester } = require("eslint");
const rule = require("../../../src/lib/rules/no-nested-ternary-operators");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
});

ruleTester.run("no-nested-ternary-operators", rule, {
  valid: [
    // valid ternary
    `const x = a ? b : c;`,

    // simple operation
    `const y = a + b;`,

    // branches with no ternary inside
    `const z = cond ? getA() : getB();`,

    // multiple conditions
    `
      const t1 = a ? b : c;
      const t2 = d ? e : f;
    `,
  ],

  invalid: [
    {
      code: `const x = a ? (b ? 1 : 2) : 3;`,
      errors: [{ messageId: "nested" }],
    },
    {
      code: `const y = a ? 1 : (b ? 2 : 3);`,
      errors: [{ messageId: "nested" }],
    },
    {
      code: `const z = (a ? 1 : 2) ? (b ? 3 : 4) : 5;`,
      errors: [{ messageId: "nested" }, { messageId: "nested" }],
    },
    {
      code: `const v = cond ? fn(b ? 10 : 20) : 0;`,
      errors: [{ messageId: "nested" }],
    },
    {
      code: `const o = a ? { k: b ? 1 : 2 } : {};`,
      errors: [{ messageId: "nested" }],
    },
    {
      code: `const arr = a ? 0 : [b ? 1 : 2];`,
      errors: [{ messageId: "nested" }],
    },
    {
      code: `const deep = a ? (b ? (c ? 1 : 2) : 3) : 4;`,
      errors: [{ messageId: "nested" }, { messageId: "nested" }],
    },
    {
      code: `const w = (a ? b : c) ? d : e;`,
      errors: [{ messageId: "nested" }],
    },
  ],
});
