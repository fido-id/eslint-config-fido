const { RuleTester } = require("eslint");
const rule = require("../../../src/lib/rules/mui-prefer-components");

const tester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
});

tester.run("mui-prefer-components", rule, {
  valid: [
    // Already using MUI
    `import { Box, Typography, Button, Link, List, ListItem } from "@mui/material";
     export default function C(){
       return (
         <Box>
           <Typography variant="h2">Title</Typography>
           <Button onClick={() => {}}>Click</Button>
           <Link href="/x">Go</Link>
           <List><ListItem>Item</ListItem></List>
         </Box>
       );
     }`,

    // Custom component (capitalized) — allowed
    `const MyDiv = (props) => <Box {...props} />; // definition is native but not JSX usage
     export default function C(){ return <MyDiv /> }`,

    // SVG ignored by default
    `<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>`,

    // Ignored via option
    {
      code: `function C(){ return <small>fine</small>; }`,
      options: [{ ignore: ["small"] }],
    },

    // Mapping override (treat 'section' as allowed via ignore)
    {
      code: `function C(){ return <section role="region" />; }`,
      options: [{ ignore: ["section"] }],
    },
  ],

  invalid: [
    // div -> Box
    {
      code: `export default function C(){ return <div className="x" /> }`,
      errors: [{ messageId: "preferMui", data: { html: "div", mui: "Box" } }],
    },

    // p -> Typography (with suggestion hint)
    {
      code: `function C(){ return <p>Hello</p>; }`,
      errors: [
        { messageId: "preferMui", data: { html: "p", mui: "Typography" } },
      ],
    },

    // headings -> Typography
    {
      code: `function C(){ return <h2>Header</h2>; }`,
      errors: [
        { messageId: "preferMui", data: { html: "h2", mui: "Typography" } },
      ],
    },

    // button -> Button
    {
      code: `function C(){ return <button type="button">Go</button>; }`,
      errors: [
        { messageId: "preferMui", data: { html: "button", mui: "Button" } },
      ],
    },

    // a -> Link
    {
      code: `function C(){ return <a href="/home">Home</a>; }`,
      errors: [{ messageId: "preferMui", data: { html: "a", mui: "Link" } }],
    },

    // ul/li -> List/ListItem
    {
      code: `function C(){ return <ul><li>Item</li></ul>; }`,
      errors: [
        { messageId: "preferMui", data: { html: "ul", mui: "List" } },
        { messageId: "preferMui", data: { html: "li", mui: "ListItem" } },
      ],
    },

    // img -> Box component="img" (we just recommend Box)
    {
      code: `function C(){ return <img src="/x.png" alt="" />; }`,
      errors: [{ messageId: "preferMui", data: { html: "img", mui: "Box" } }],
    },

    // table -> Table
    {
      code: `function C(){ return <table><tr><td>v</td></tr></table>; }`,
      errors: [
        { messageId: "preferMui", data: { html: "table", mui: "Table" } },
        { messageId: "preferMui", data: { html: "tr", mui: "TableRow" } },
        { messageId: "preferMui", data: { html: "td", mui: "TableCell" } },
      ],
    },

    // custom mapping override
    {
      code: `function C(){ return <article />; }`,
      options: [{ mapping: { article: "Paper" } }],
      errors: [
        { messageId: "preferMui", data: { html: "article", mui: "Paper" } },
      ],
    },
  ],
});
