import { useCallback } from "react";
import {
  createLoopFunctionEndNode,
  createLoopFunctionStartNode,
} from "../modules/loopFunction/node-utils";
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

/**
 * 提供 LOOP 函数标签的插入动作。
 */
function useLoopFunctionActions({
  editor,
} = {}) {
  const editorRef = useEditorRef(editor);

  const insertLoopFunction = useCallback(
    (variableName, bodyText, deleteMention = false) => {
      const currentEditor = editorRef.current;
      const normalizedVariableName = String(variableName || "").trim();
      if (!currentEditor || !normalizedVariableName) {
        return;
      }

      currentEditor.restoreSelection();

      if (deleteMention) {
        currentEditor.deleteBackward("character");
      }

      const startNode = createLoopFunctionStartNode(normalizedVariableName);
      const endNode = createLoopFunctionEndNode(normalizedVariableName);
      const normalizedBodyText = typeof bodyText === "string" ? bodyText : "";

      currentEditor.insertNode(startNode);
      insertTextAfterInlineVoid(currentEditor, normalizedBodyText);
      currentEditor.insertNode(endNode);
      currentEditor.move(1);
    },
    [editorRef],
  );

  return {
    insertLoopFunction,
  };
}

export default useLoopFunctionActions;

