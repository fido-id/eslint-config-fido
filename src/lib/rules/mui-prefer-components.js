"use strict";

/**
 * ESLint Rule: mui-prefer-components
 *
 * Reports use of native HTML elements in JSX when a Material UI component exists.
 *
 * Options (optional):
 * {
 *   ignore: string[]; // list of HTML tags to ignore (e.g., ["small", "strong"])
 * }
 */

const DEFAULT_IGNORE = new Set([
  // SVG tags — we don't try to enforce MUI equivalents here
  "svg",
  "path",
  "g",
  "defs",
  "use",
  "line",
  "circle",
  "rect",
  "polyline",
  "polygon",
  "ellipse",
  "clipPath",
  "mask",
]);

// Conservative default mapping. Feel free to extend it in your codebase.
const HTML_TO_MUI = {
  // layout
  div: "Box",
  span: "Box",
  section: "Box",
  article: "Box",
  header: "Box",
  footer: "Box",
  main: "Box",
  nav: "Box",

  // text
  p: "Typography",
  h1: "Typography",
  h2: "Typography",
  h3: "Typography",
  h4: "Typography",
  h5: "Typography",
  h6: "Typography",

  // interactivity
  button: "Button",
  a: "Link",

  // lists
  ul: "List",
  li: "ListItem",

  // media
  img: "Box", // usually <Box component="img" ... />
  picture: "Box",

  // tables (high-level)
  table: "Table",
  thead: "TableHead",
  tbody: "TableBody",
  tfoot: "TableFooter",
  tr: "TableRow",
  td: "TableCell",
  th: "TableCell",
};

function isLowerCaseTag(name) {
  return typeof name === "string" && name === name.toLowerCase();
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "If MUI provides an equivalent, use the MUI component instead of native HTML elements in JSX.",
      recommended: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          ignore: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
          },
          mapping: {
            type: "object",
            additionalProperties: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferMui:
        "Use MUI '{{mui}}' instead of native '<{{html}}>' to keep consistency with the design system.",
      hintTypography:
        'Consider <Typography variant="body1|h1|h2|..."> for text elements.',
      hintBoxImg: 'Consider <Box component="img" ...> for images.',
    },
    hasSuggestions: true,
  },

  create(context) {
    const opts = context.options[0] || {};
    const ignore = new Set([...(opts.ignore || []), ...DEFAULT_IGNORE]);
    const mapping = { ...HTML_TO_MUI, ...(opts.mapping || {}) };

    return {
      JSXOpeningElement(node) {
        // Only check simple identifiers: <div> not <X.Y>
        if (node.name.type !== "JSXIdentifier") return;

        const tag = node.name.name;
        if (!isLowerCaseTag(tag)) return; // likely a custom component
        if (ignore.has(tag)) return;

        const mui = mapping[tag];
        if (!mui) return;

        // If they already use <Box component="div"> etc., that's fine — we only report native tag usage here.
        context.report({
          node,
          messageId: "preferMui",
          data: { html: tag, mui },
          suggest: [
            ...(mui === "Typography" ? [{ messageId: "hintTypography" }] : []),
            ...(tag === "img" ? [{ messageId: "hintBoxImg" }] : []),
          ].map((s) => ({ ...s, fix: () => null })),
        });
      },
    };
  },
};
