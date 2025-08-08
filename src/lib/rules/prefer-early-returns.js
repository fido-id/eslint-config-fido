module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Avoid else-if and else blocks that just contain an if. Prefer early returns (guard clauses).",
      recommended: false,
    },
    schema: [],
    hasSuggestions: true,
    messages: {
      noElseIf:
        "Avoid 'else if'. Prefer early returns (guard clauses) instead of deep nesting.",
      noElseBlockIf:
        "Avoid 'else' that only wraps an 'if'. Prefer early returns (guard clauses).",
      suggestRewrite:
        "Refactor to guard clauses (if with early return) to remove the else nesting.",
    },
  },

  create(context) {
    function isElseBlockWithSingleIf(block) {
      if (!block || block.type !== "BlockStatement") return false;
      const body = block.body.filter(
        (s) => s.type !== "EmptyStatement", // ignora statement vuoti
      );
      return body.length === 1 && body[0].type === "IfStatement";
    }

    return {
      IfStatement(node) {
        const alt = node.alternate;
        if (!alt) return;

        // Case 1 1: else-if
        if (alt.type === "IfStatement") {
          context.report({
            node: alt,
            messageId: "noElseIf",
            suggest: [
              {
                messageId: "suggestRewrite",
                fix: () => null, // niente auto-fix
              },
            ],
          });
          return;
        }

        // Case 2: else { if (...) { ... } }
        if (isElseBlockWithSingleIf(alt)) {
          const innerIf = alt.body.find((s) => s.type === "IfStatement") || alt;
          context.report({
            node: innerIf,
            messageId: "noElseBlockIf",
            suggest: [
              {
                messageId: "suggestRewrite",
                fix: () => null,
              },
            ],
          });
        }
      },
    };
  },
};
