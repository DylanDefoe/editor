import { useEffect } from "react";
import {
  IF_FUNCTION_START_ELEMENT_TYPE,
  JOIN_FUNCTION_ELEMENT_TYPE,
} from "../config/editorConfig";
import { getSelectedIfFunctionStartEntry } from "../modules/ifFunction/node-utils";
import { getSelectedJoinFunctionEntry } from "../modules/joinFunction/node-utils";

/**
 * 统一绑定 RichEditor editable 区域事件：beforeinput、ifFunction 与 joinFunction 点击。
 */
function useRichEditorDomEvents({
  editor,
  onBeforeInput,
  onIfFunctionStartClick,
  onJoinFunctionClick,
}) {
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

    const handleIfFunctionClick = (event) => {
      if (!onIfFunctionStartClick) {
        return;
      }

      const startTagElement = event.target?.closest?.(
        `span[data-w-e-type="${IF_FUNCTION_START_ELEMENT_TYPE}"]`,
      );

      if (!startTagElement) {
        return;
      }

      const condition = startTagElement.getAttribute("data-condition") || "";
      if (!condition.trim()) {
        return;
      }

      const entry = getSelectedIfFunctionStartEntry(editor);
      const path = entry ? entry[1] : null;

      onIfFunctionStartClick({ condition, path });

      return;
    };

    const handleJoinFunctionClick = (event) => {
      if (!onJoinFunctionClick) {
        return;
      }

      const joinElement = event.target?.closest?.(
        `span[data-w-e-type="${JOIN_FUNCTION_ELEMENT_TYPE}"]`,
      );

      if (!joinElement) {
        return;
      }

      const variableName = String(joinElement.getAttribute("data-variable-name") || "").trim();
      if (!variableName) {
        return;
      }

      const separator = String(joinElement.getAttribute("data-separator") || "");
      const entry = getSelectedJoinFunctionEntry(editor);
      const path = entry ? entry[1] : null;

      onJoinFunctionClick({ variableName, separator, path });
    };

    const handleClick = (event) => {
      handleIfFunctionClick(event);
      handleJoinFunctionClick(event);
    };

    editableContainer.addEventListener("beforeinput", handleBeforeInput);
    editableContainer.addEventListener("click", handleClick);

    return () => {
      editableContainer.removeEventListener("beforeinput", handleBeforeInput);
      editableContainer.removeEventListener("click", handleClick);
    };
  }, [editor, onBeforeInput, onIfFunctionStartClick, onJoinFunctionClick]);
}

export default useRichEditorDomEvents;
