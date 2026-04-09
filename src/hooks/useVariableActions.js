import { useCallback } from "react";
import { createVariableNode } from "../utils/variableNodeUtils";
import useEditorRef from "./useEditorRef";

/**
 * 提供变量节点插入动作。
 */
function useVariableActions({
  // 编辑器实例
  editor,
} = {}) {
  const editorRef = useEditorRef(editor);

  // 插入变量节点
  const insertVariable = useCallback((key, deleteMention) => {
    const currentEditor = editorRef.current;

    if (!currentEditor || !key) {
      return;
    }

    // 还原选区
    currentEditor.restoreSelection();

    // mention 场景下删除光标前的触发字符（如 @）
    if (deleteMention) {
      currentEditor.deleteBackward("character");
    }

    // 创建并插入变量节点（void inline element）
    const variableNode = createVariableNode(key);
    currentEditor.insertNode(variableNode);

    // 移动光标到变量后面
    currentEditor.move(1);
  }, [editorRef]);

  return {
    insertVariable,
  };
}

export default useVariableActions;
