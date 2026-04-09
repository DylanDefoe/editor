import { useCallback } from "react";
import {
  createFunctionTagEndNode,
  createFunctionTagStartNode,
} from "../utils/functionTagNodeUtils";
import useEditorRef from "./useEditorRef";

/**
 * 在 inline-void 节点后移动光标并插入正文文本。
 */
const insertTextAfterInlineVoid = (editor, text) => {
  editor.move(1);

  if (text) {
    editor.insertText(text);
  }
};

function useFunctionTagActions({
  editor,
} = {}) {
  const editorRef = useEditorRef(editor);

  const insertFunctionTag = useCallback(
    (condition, bodyText, deleteMention = false) => {
      const currentEditor = editorRef.current;

      if (!currentEditor || typeof condition !== "string" || !condition.trim()) {
        return;
      }

      currentEditor.restoreSelection();

      if (deleteMention) {
        currentEditor.deleteBackward("character");
      }

      const functionTagStartNode = createFunctionTagStartNode(condition);
      const functionTagEndNode = createFunctionTagEndNode();
      const normalizedBodyText = typeof bodyText === "string" ? bodyText : "";

      currentEditor.insertNode(functionTagStartNode);
      insertTextAfterInlineVoid(currentEditor, normalizedBodyText);

      currentEditor.insertNode(functionTagEndNode);
      currentEditor.move(1);
    },
    [editorRef],
  );

  return {
    insertFunctionTag,
  };
}

/**
 * 提供 IF 函数标签的插入动作。
 */
export default useFunctionTagActions;
