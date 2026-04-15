import {
  isLoopFunctionEndNode,
  isLoopFunctionStartNode,
} from "./node-utils";

/**
 * loopFunction 插件：覆写 isInline/isVoid，将 start/end 视为 inline-void。
 */
function withLoopFunction(editor) {
  const { isInline, isVoid } = editor;
  const newEditor = editor;

  newEditor.isInline = (element) => {
    return (
      isLoopFunctionStartNode(element) ||
      isLoopFunctionEndNode(element) ||
      isInline(element)
    );
  };

  newEditor.isVoid = (element) => {
    return (
      isLoopFunctionStartNode(element) ||
      isLoopFunctionEndNode(element) ||
      isVoid(element)
    );
  };

  return newEditor;
}

export default withLoopFunction;

