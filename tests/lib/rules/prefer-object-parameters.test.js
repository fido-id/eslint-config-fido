const { RuleTester } = require("eslint");
const rule = require("../../../src/lib/rules/prefer-object-parameters");
const tester = new RuleTester({
  // Make sure classes and method shorthand are parsed
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { globalReturn: false },
  },
});

tester.run("prefer-object-parameters", rule, {
  valid: [
    // --- DEFINITIONS (valid) ---
    { code: `function f(a, b, c) {}` }, // default max=4
    { code: `const f = (a, b, c, d) => {};` },

    // already using a single object param
    { code: `function f(opts) {}` },
    { code: `const f = ({ a, b, c, d, e }) => {};` },

    // --- CALLS (valid) ---
    { code: `f(a, b, c);` },
    { code: `new Foo(a, b, c, d);` },

    { code: `f({ a, b, c, d, e });` },

    {
      code: `console.log(a, b, c, d, e);`,
      options: [{ ignoreCallees: ["console.log"] }],
    },

    { code: `f(a, b, c, d, e);`, options: [{ checkCalls: false }] },
    {
      code: `function g(a, b, c, d, e) {}`,
      options: [{ checkDefinitions: false }],
    },
  ],

  invalid: [
    // --- DEFINITIONS (invalid) ---
    {
      code: `function f(a, b, c, d, e) {}`,
      errors: [{ messageId: "tooManyParamsDef" }],
    },
    {
      code: `const f = function(a, b, c, d, e) {};`,
      errors: [{ messageId: "tooManyParamsDef" }],
    },
    {
      code: `const f = (a, b, c, d, e) => {};`,
      errors: [{ messageId: "tooManyParamsDef" }],
    },

    // class/object methods should be invalid unless ignoreMethods: true
    {
      code: `class A { m(a, b, c, d, e) {} }`,
      // default ignoreMethods = false
      errors: [
        { messageId: "tooManyParamsDef" },
        { messageId: "tooManyParamsDef" },
      ],
    },
    {
      code: `const o = { m(a, b, c, d, e) {} };`,
      errors: [
        { messageId: "tooManyParamsDef" },
        { messageId: "tooManyParamsDef" },
      ],
    },

    // custom max = 3
    {
      code: `function withMax(a, b, c, d) {}`,
      options: [{ max: 3 }],
      errors: [{ messageId: "tooManyParamsDef" }],
    },

    // --- CALLS (invalid) ---
    { code: `f(a, b, c, d, e);`, errors: [{ messageId: "tooManyArgsCall" }] },
    {
      code: `new Foo(a, b, c, d, e, f);`,
      errors: [{ messageId: "tooManyArgsCall" }],
    },
    {
      code: `doSomething(a, b, c, d);`,
      options: [{ max: 3 }],
      errors: [{ messageId: "tooManyArgsCall" }],
    },
    {
      code: `console.warn(a, b, c, d, e);`,
      options: [{ ignoreCallees: ["console.log"] }],
      errors: [{ messageId: "tooManyArgsCall" }],
    },
  ],
});
