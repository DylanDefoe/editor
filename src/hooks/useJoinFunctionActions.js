import { useCallback } from "react";
import { createJoinFunctionNode } from "../modules/joinFunction/node-utils";
import useEditorRef from "./useEditorRef";

/**
 * 提供 JOIN 函数标签的插入动作。
 */
function useJoinFunctionActions({
  editor,
} = {}) {
  const editorRef = useEditorRef(editor);

  const insertJoinFunction = useCallback(
    ({ variableName, separator }, deleteMention = false) => {
      const currentEditor = editorRef.current;
      const normalizedVariableName = String(variableName || "").trim();

      if (!currentEditor || !normalizedVariableName) {
        return;
      }

      currentEditor.restoreSelection();

      if (deleteMention) {
        currentEditor.deleteBackward("character");
      }

      const joinNode = createJoinFunctionNode(normalizedVariableName, separator);
      currentEditor.insertNode(joinNode);
      currentEditor.move(1);
    },
    [editorRef],
  );

  return {
    insertJoinFunction,
  };
}

export default useJoinFunctionActions;

