import { isJoinFunctionNode } from "./node-utils";

/**
 * joinFunction 插件：覆写 isInline/isVoid，将节点视为 inline-void。
 */
function withJoinFunction(editor) {
  const { isInline, isVoid } = editor;
  const newEditor = editor;

  newEditor.isInline = (element) => {
    return isJoinFunctionNode(element) || isInline(element);
  };

  newEditor.isVoid = (element) => {
    return isJoinFunctionNode(element) || isVoid(element);
  };

  return newEditor;
}

export default withJoinFunction;

