import { useCallback, useState } from "react";
import {
  patchFunctionTagStartConditionAtPath,
  patchSelectedFunctionTagStartCondition,
} from "../utils/functionTagNodeUtils";

const IF_MODAL_MODE = Object.freeze({
  create: "create",
  edit: "edit",
});

const DEFAULT_IF_BODY_TEXT = "需要展示的文案";

/**
 * 管理 IF 条件弹窗的 create/edit 状态，并统一保存分流逻辑。
 */
function useIfFunctionModalController({ activeEditor, insertFunctionTag }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(IF_MODAL_MODE.create);
  const [initialCondition, setInitialCondition] = useState("");
  const [editingStartNodePath, setEditingStartNodePath] = useState(null);

  const resetModalState = useCallback(() => {
    setMode(IF_MODAL_MODE.create);
    setInitialCondition("");
    setEditingStartNodePath(null);
  }, []);

  const openForCreate = useCallback(() => {
    resetModalState();
    setOpen(true);
  }, [resetModalState]);

  const openForEdit = useCallback(
    (condition, path) => {
      if (typeof condition !== "string" || !condition.trim()) {
        return;
      }

      setMode(IF_MODAL_MODE.edit);
      setInitialCondition(condition);
      setEditingStartNodePath(path);
      setOpen(true);
    },
    [],
  );

  const closeAndReset = useCallback(() => {
    setOpen(false);
    resetModalState();
  }, [resetModalState]);

  const saveCondition = useCallback(
    ({ condition }) => {
      if (mode === IF_MODAL_MODE.edit) {
        const updated = patchSelectedFunctionTagStartCondition(
          activeEditor,
          condition,
        );

        if (!updated) {
          patchFunctionTagStartConditionAtPath(
            activeEditor,
            editingStartNodePath,
            condition,
          );
        }
      } else {
        insertFunctionTag(condition, DEFAULT_IF_BODY_TEXT, false);
      }

      closeAndReset();
    },
    [activeEditor, closeAndReset, editingStartNodePath, insertFunctionTag, mode],
  );

  return {
    open,
    initialCondition,
    openForCreate,
    openForEdit,
    closeAndReset,
    saveCondition,
  };
}

export default useIfFunctionModalController;
