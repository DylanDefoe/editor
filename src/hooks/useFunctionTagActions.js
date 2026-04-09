import { useCallback, useEffect, useRef } from "react";
import {
  createFunctionTagEndNode,
  createFunctionTagStartNode,
} from "../utils/functionTagNodeUtils";

function useFunctionTagActions({
  editor,
} = {}) {
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

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

      currentEditor.insertNode(functionTagStartNode);
      currentEditor.insertText(typeof bodyText === "string" ? bodyText : "");
      currentEditor.insertNode(functionTagEndNode);
      currentEditor.move(1);
    },
    [],
  );

  return {
    insertFunctionTag,
  };
}

export default useFunctionTagActions;
