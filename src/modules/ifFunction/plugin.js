import {
  isIfFunctionEndNode,
  isIfFunctionStartNode,
} from "./node-utils";

/**
 * ifFunction 插件：覆写 isInline/isVoid，将 start/end 视为 inline-void。
 */
function withIfFunction(editor) {
  const { isInline, isVoid } = editor;
  const newEditor = editor;

  newEditor.isInline = (element) => {
    return (
      isIfFunctionStartNode(element) ||
      isIfFunctionEndNode(element) ||
      isInline(element)
    );
  };

  newEditor.isVoid = (element) => {
    return (
      isIfFunctionStartNode(element) ||
      isIfFunctionEndNode(element) ||
      isVoid(element)
    );
  };

  return newEditor;
}

export default withIfFunction;
