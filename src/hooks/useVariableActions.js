import { useCallback, useEffect, useRef } from "react";
import { SlateTransforms } from "@wangeditor/editor";
import { createVariableNode } from "../utils/variableNodeUtils";

function useVariableActions({
  // 编辑器实例
  editor,
} = {}) {
  // 统一通过 ref 持有 editor，避免外部回调在闭包中拿到旧实例
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // 插入变量节点
  const insertVariable = useCallback((key, deleteMention) => {
    const currentEditor = editorRef.current;

    if (!currentEditor || !key) {
      return;
    }

    currentEditor.focus();

    // mention 场景下删除光标前的触发字符（如 @）
    if (deleteMention) {
      currentEditor.deleteBackward('character');
    }

    // 创建并插入变量节点（void inline element）
    const variableNode = createVariableNode(key);
    SlateTransforms.insertNodes(currentEditor, variableNode);

    // 移动光标到变量后面
    SlateTransforms.move(currentEditor);
  }, []);

  return {
    insertVariable,
  };
}

export default useVariableActions;
