import { useCallback, useEffect, useRef } from "react";
import { SlateEditor, SlateRange, SlateTransforms } from "@wangeditor/editor";
import { VARIABLE_TOKEN_CONFIG } from "../config/editorConfig";
import { buildVariableToken } from "../utils/editorUtils";

// 记录已注入删除守卫的 editor，避免重复覆盖原生删除行为。
const guardedEditors = new WeakSet();

// 从纯文本中提取所有变量 token（如 {{name}}）的起止区间。
const getTokenRanges = (text, { prefix, suffix }) => {
  const ranges = [];
  let cursor = 0;

  while (cursor < text.length) {
    const start = text.indexOf(prefix, cursor);
    if (start < 0) {
      break;
    }

    const tokenStart = start + prefix.length;
    const suffixIndex = text.indexOf(suffix, tokenStart);
    if (suffixIndex < 0) {
      break;
    }

    const end = suffixIndex + suffix.length;
    if (tokenStart < suffixIndex) {
      ranges.push({ start, end });
    }
    cursor = end;
  }

  return ranges;
};

// 根据删除方向定位当前光标命中的 token 区间。
const findTargetTokenRange = ({ text, offset, direction, tokenConfig }) => {
  const tokenRanges = getTokenRanges(text, tokenConfig);

  if (direction === "backward") {
    return (
      tokenRanges.find(({ start, end }) => offset > start && offset <= end) ||
      null
    );
  }

  return (
    tokenRanges.find(({ start, end }) => offset >= start && offset < end) ||
    null
  );
};

function useVariableActions({
  // 编辑器实例
  editor,
} = {}) {
  // 统一通过 ref 持有 editor，避免外部回调在闭包中拿到旧实例。
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const insertVariable = useCallback((key, deleteMention) => {
    const currentEditor = editorRef.current;

    if (!currentEditor || !key) {
      return;
    }

    const token = buildVariableToken(key);
    currentEditor.focus();
    // mention 场景下可选删除光标前一个触发字符（如 @）。
    if (deleteMention) {
      currentEditor.deleteBackward();
    }
    currentEditor.insertText(token);
  }, []);

  // 当光标位于变量 token 内部或边界时，执行整块删除。
  const deleteWholeToken = useCallback(({ direction }) => {
    const currentEditor = editorRef.current;

    if (
      !currentEditor?.selection ||
      !SlateRange.isCollapsed(currentEditor.selection)
    ) {
      return false;
    }

    const {
      anchor: { path, offset },
    } = currentEditor.selection;

    let text = "";
    try {
      text = SlateEditor.string(currentEditor, path);
    } catch {
      return false;
    }

    if (!text) {
      return false;
    }

    const target = findTargetTokenRange({
      text,
      offset,
      direction,
      tokenConfig: VARIABLE_TOKEN_CONFIG,
    });

    if (!target) {
      return false;
    }

    SlateTransforms.select(currentEditor, {
      anchor: { path, offset: target.start },
      focus: { path, offset: target.end },
    });
    SlateTransforms.delete(currentEditor);

    return true;
  }, []);

  const attachVariableDeleteGuards = useCallback(() => {
    const currentEditor = editorRef.current;

    if (!currentEditor || guardedEditors.has(currentEditor)) {
      return;
    }

    const originalDeleteBackward =
      currentEditor.deleteBackward?.bind(currentEditor);
    const originalDeleteForward =
      currentEditor.deleteForward?.bind(currentEditor);

    if (!originalDeleteBackward || !originalDeleteForward) {
      return;
    }

    // 覆写退格：命中 token 时整块删除，否则走编辑器默认逻辑。
    currentEditor.deleteBackward = (...args) => {
      if (deleteWholeToken({ direction: "backward" })) {
        return;
      }

      originalDeleteBackward(...args);
    };

    // 覆写删除键：命中 token 时整块删除，否则走编辑器默认逻辑。
    currentEditor.deleteForward = (...args) => {
      if (deleteWholeToken({ direction: "forward" })) {
        return;
      }

      originalDeleteForward(...args);
    };

    guardedEditors.add(currentEditor);
  }, [deleteWholeToken]);

  useEffect(() => {
    // editor 变化时尝试重新注入（WeakSet 会防止同实例重复注入）。
    attachVariableDeleteGuards();
  }, [attachVariableDeleteGuards, editor]);

  return {
    insertVariable,
    attachVariableDeleteGuards,
  };
}

export default useVariableActions;
