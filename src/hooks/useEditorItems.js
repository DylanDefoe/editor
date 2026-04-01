import { useCallback, useRef, useState } from "react";

function useEditorItems({
  // 编辑器初始 HTML 内容
  initialHtml,
}) {
  const [editorItems, setEditorItems] = useState(() => [
    {
      id: 1,
      html: initialHtml,
    },
  ]);
  const idRef = useRef(2);

  const updateEditorHtml = useCallback((id, nextHtml) => {
    setEditorItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, html: nextHtml } : item)),
    );
  }, []);

  const copyEditor = useCallback((id) => {
    setEditorItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) {
        return prev;
      }

      return [
        ...prev,
        {
          id: idRef.current++,
          html: target.html,
        },
      ];
    });
  }, []);

  return {
    editorItems,
    updateEditorHtml,
    copyEditor,
  };
}

export default useEditorItems;
