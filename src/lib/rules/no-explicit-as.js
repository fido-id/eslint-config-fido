module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow explicit casting with 'as' in TypeScript",
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
        context.report({
          node,
          messageId: "noExplicitAs",
        });
      },
    };
  },
};
