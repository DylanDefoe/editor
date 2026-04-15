import { useCallback } from "react";
import {
  createIfFunctionEndNode,
  createIfFunctionStartNode,
} from "../utils/ifFunctionNodeUtils";
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

function useIfFunctionActions({
  editor,
} = {}) {
  const editorRef = useEditorRef(editor);

  const insertIfFunction = useCallback(
    (condition, bodyText, deleteMention = false) => {
      const currentEditor = editorRef.current;

      if (!currentEditor || typeof condition !== "string" || !condition.trim()) {
        return;
      }

      currentEditor.restoreSelection();

      if (deleteMention) {
        currentEditor.deleteBackward("character");
      }

      const ifFunctionStartNode = createIfFunctionStartNode(condition);
      const ifFunctionEndNode = createIfFunctionEndNode();
      const normalizedBodyText = typeof bodyText === "string" ? bodyText : "";

      currentEditor.insertNode(ifFunctionStartNode);
      insertTextAfterInlineVoid(currentEditor, normalizedBodyText);

      currentEditor.insertNode(ifFunctionEndNode);
      currentEditor.move(1);
    },
    [editorRef],
  );

  return {
    insertIfFunction,
  };
}

/**
 * 提供 IF 函数标签的插入动作。
 */
export default useIfFunctionActions;
