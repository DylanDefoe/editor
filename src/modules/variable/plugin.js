import { isVariableNode } from "./node-utils";

/**
 * variable 插件：覆写 isInline/isVoid，将 variable 视为 inline-void。
 */
function withVariable(editor) {
  const { isInline, isVoid } = editor;
  const newEditor = editor;

  newEditor.isInline = (element) => {
    return isVariableNode(element) || isInline(element);
  };

  newEditor.isVoid = (element) => {
    return isVariableNode(element) || isVoid(element);
  };

  return newEditor;
}

export default withVariable;
