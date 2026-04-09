import { useEffect } from "react";
import { FUNCTION_TAG_START_ELEMENT_TYPE } from "../config/editorConfig";
import { getSelectedFunctionTagStartEntry } from "../utils/functionTagNodeUtils";

/**
 * 统一绑定 RichEditor editable 区域事件：beforeinput 和 function-start 点击。
 */
function useRichEditorDomEvents({ editor, onBeforeInput, onFunctionTagStartClick }) {
  useEffect(() => {
    if (!editor) {
      return undefined;
    }

    const editableContainer = editor.getEditableContainer();
    if (!editableContainer) {
      return undefined;
    }

    const handleBeforeInput = (event) => {
      onBeforeInput?.(event);
    };

    const handleClick = (event) => {
      if (!onFunctionTagStartClick) {
        return;
      }

      const startTagElement = event.target?.closest?.(
        `span[data-w-e-type="${FUNCTION_TAG_START_ELEMENT_TYPE}"]`,
      );

      if (!startTagElement) {
        return;
      }

      const condition = startTagElement.getAttribute("data-condition") || "";
      if (!condition.trim()) {
        return;
      }

      const entry = getSelectedFunctionTagStartEntry(editor);
      const path = entry ? entry[1] : null;

      onFunctionTagStartClick({ condition, path });
    };

    editableContainer.addEventListener("beforeinput", handleBeforeInput);
    editableContainer.addEventListener("click", handleClick);

    return () => {
      editableContainer.removeEventListener("beforeinput", handleBeforeInput);
      editableContainer.removeEventListener("click", handleClick);
    };
  }, [editor, onBeforeInput, onFunctionTagStartClick]);
}

export default useRichEditorDomEvents;
