/**
 * Rule: Do not use ternary operators inside other ternaries.
 */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow using ternary operators inside other ternary operators",
      recommended: false,
    },
    schema: [],
    messages: {
      nested: "Do not use ternary operators inside other ternaries.",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function findNestedConditional(start) {
      if (!start || typeof start !== "object") return null;

      const stack = [start];
      const keysMap = sourceCode.visitorKeys || {};

      while (stack.length) {
        const node = stack.pop();
        if (!node || typeof node !== "object") continue;

        if (node.type === "ConditionalExpression") {
          return node;
        }

        const keys = keysMap[node.type] || [];
        for (const key of keys) {
          const child = node[key];
          const children = Array.isArray(child) ? child : [child];

          for (let i = children.length - 1; i >= 0; i--) {
            if (children[i] && typeof children[i] === "object") {
              stack.push(children[i]);
            }
          }
        }
      }
      return null;
    }

    return {
      ConditionalExpression(node) {
        const parts = [node.test, node.consequent, node.alternate];

        for (const part of parts) {
          const nested = findNestedConditional(part);
          if (nested) {
            context.report({ node: nested, messageId: "nested" });
          }
        }
      },
    };
  },
};
