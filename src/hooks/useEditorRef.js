import { useEffect, useRef } from "react";

/**
 * 将 editor 实例同步到 ref，避免回调闭包拿到旧实例。
 */
function useEditorRef(editor) {
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  return editorRef;
}

export default useEditorRef;
