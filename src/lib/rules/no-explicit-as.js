module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow explicit casting with 'as' in TypeScript (except 'as const')",
      recommended: false,
    },
    schema: [],
    messages: {
      noExplicitAs:
        "Avoid using 'as' for casting. Use safer alternatives (e.g., type guards).",
    },
  },
  create(context) {
    return {
      TSAsExpression(node) {
        if (
          node.typeAnnotation &&
          node.typeAnnotation.typeName &&
          node.typeAnnotation.typeName.name &&
          node.typeAnnotation.typeName.name === "const"
        ) {
          return;
        }
        context.report({
          node,
          messageId: "noExplicitAs",
        });
      },
    };
  },
};
