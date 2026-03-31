import { useCallback, useRef, useState } from "react";

function useFocusEditor() {
  // 当前激活的编辑器实例，用于变量插入和 mention 定位。
  const [activeEditor, setActiveEditor] = useState(null);
  const editorsRef = useRef([]);

  // 仅通过 editor.isFocused() 判断焦点归属。
  const findFocusedEditor = useCallback(() => {
    return editorsRef.current.find((editor) => editor.isFocused?.());
  }, []);

  const syncActiveEditor = useCallback(() => {
    const focusedEditor = findFocusedEditor();
    // 如果找到了焦点编辑器，则设置为当前激活编辑器；如果没有找到，则保持原有激活编辑器不变（避免误切）。
    setActiveEditor((prev) => focusedEditor ?? prev);
  }, [findFocusedEditor]);

  const registerEditor = useCallback(
    (editor) => {
      if (!editor) {
        return;
      }
      editorsRef.current.push(editor);
      syncActiveEditor();
    },
    [syncActiveEditor],
  );

  return {
    activeEditor,
    registerEditor,
    syncActiveEditor,
  };
}

export default useFocusEditor;
