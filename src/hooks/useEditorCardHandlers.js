import { useCallback, useMemo } from "react";

/**
 * 聚合编辑器卡片映射和 handlers，减少页面组件中的重复构建逻辑。
 */
function useEditorCardHandlers({
  editorItems,
  updateEditorHtml,
  syncActiveEditor,
  copyEditor,
}) {
  const handleEditorChange = useCallback(
    (id) =>
      (nextHtml) => {
        updateEditorHtml(id, nextHtml);
        syncActiveEditor();
      },
    [syncActiveEditor, updateEditorHtml],
  );

  const editorCards = useMemo(() => {
    return editorItems.map((item, index) => ({
      id: item.id,
      index,
      html: item.html,
    }));
  }, [editorItems]);

  const editorChangeHandlers = useMemo(() => {
    const handlers = {};

    editorCards.forEach((item) => {
      handlers[item.id] = handleEditorChange(item.id);
    });

    return handlers;
  }, [editorCards, handleEditorChange]);

  const editorCopyHandlers = useMemo(() => {
    const handlers = {};

    editorCards.forEach((item) => {
      handlers[item.id] = () => {
        copyEditor(item.id);
      };
    });

    return handlers;
  }, [copyEditor, editorCards]);

  return {
    editorCards,
    editorChangeHandlers,
    editorCopyHandlers,
  };
}

export default useEditorCardHandlers;
