import { useCallback, useState } from "react";
import { VARIABLE_MENTION_CONFIG } from "../config/mention";

function useVariableMention({
  // 编辑器实例
  editor,
}) {
  // mention 弹层显示状态。
  const [open, setOpen] = useState(false);
  // mention 弹层在视口中的定位坐标（fixed）。
  const [position, setPosition] = useState(null);

  const closeMention = useCallback(() => {
    setOpen(false);
    setPosition(null);
  }, []);

  const getMentionPosition = useCallback(() => {
    if (!editor) {
      return null;
    }

    // 优先使用原生 selection 的几何信息，定位更贴近光标。
    const nativeSelection = window.getSelection();
    if (nativeSelection?.rangeCount) {
      const rangeRect = nativeSelection.getRangeAt(0).getBoundingClientRect();
      if (rangeRect.width || rangeRect.height) {
        return {
          top: rangeRect.bottom + 6,
          left: rangeRect.left,
        };
      }
    }

    const selectionPosition = editor.getSelectionPosition?.();
    const top = Number.parseFloat(selectionPosition?.top);
    const left = Number.parseFloat(selectionPosition?.left);

    if (Number.isNaN(top) || Number.isNaN(left)) {
      return null;
    }

    return { top: top + 6, left };
  }, [editor]);

  // 打开 mention，并记录当前应展示的位置。
  const openMention = useCallback(() => {
    if (!editor?.selection) {
      return;
    }

    setPosition(getMentionPosition());
    setOpen(true);
  }, [editor, getMentionPosition]);

  const handleEditorBeforeInput = useCallback(
    (event) => {
      if (!editor) {
        return;
      }

      if (event.data === VARIABLE_MENTION_CONFIG.triggerChar) {
        // 输入触发字符时打开 mention。
        openMention();
        return;
      }

      if (open) {
        // 继续输入普通文本时关闭 mention。
        closeMention();
      }
    },
    [closeMention, editor, open, openMention],
  );

  return {
    open,
    position,
    closeMention,
    handleEditorBeforeInput,
  };
}

export default useVariableMention;
