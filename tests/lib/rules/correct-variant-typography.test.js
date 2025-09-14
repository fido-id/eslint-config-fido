// eslint-plugin-typography-variant/tests/variant-format.test.ts
const { tester } = require("../../tester");
const rule = require("../../../src/lib/rules/correct-variant-typography");

tester.run("correct-variant-typography", rule, {
  valid: [
    { code: `<Typography variant="12_400">Hello</Typography>` },
    { code: `<Typography variant="99_999">World</Typography>` },
    { code: `<OtherComponent variant="body2" />` },
    {
      code: `<Typography{...foo} sx={{ textDecoration: 'none' }}>With spread operator</Typography>`,
    },
  ],
  invalid: [
    {
      code: `<Typography variant="body2">Hello</Typography>`,
      errors: [{ messageId: "invalidVariant" }],
    },
    {
      code: `<Typography variant="h1">Title</Typography>`,
      errors: [{ messageId: "invalidVariant" }],
    },
    {
      code: `<Typography variant="12_400" style={{fontSize:12}}>Hello</Typography>`,
      errors: [{ messageId: "forbiddenFontStyle" }],
    },
    {
      code: `<Typography variant="12_400" style={{fontWeight:12}}>Hello</Typography>`,
      errors: [{ messageId: "forbiddenFontStyle" }],
    },
    {
      code: `<Typography variant="123_45">Test</Typography>`,
      errors: [{ messageId: "invalidVariant" }],
    },
  ],
});
