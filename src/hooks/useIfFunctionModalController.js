import { useCallback, useState } from "react";
import {
  patchIfFunctionStartConditionAtPath,
  patchSelectedIfFunctionStartCondition,
} from "../utils/ifFunctionNodeUtils";

const IF_MODAL_MODE = Object.freeze({
  create: "create",
  edit: "edit",
});

const DEFAULT_IF_BODY_TEXT = "需要展示的文案";

/**
 * 管理 IF 条件弹窗的 create/edit 状态，并统一保存分流逻辑。
 */
function useIfFunctionModalController({ activeEditor, insertIfFunction }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(IF_MODAL_MODE.create);
  const [initialCondition, setInitialCondition] = useState("");
  const [editingStartNodePath, setEditingStartNodePath] = useState(null);
  const [deleteMentionOnCreate, setDeleteMentionOnCreate] = useState(false);

  const resetModalState = useCallback(() => {
    setMode(IF_MODAL_MODE.create);
    setInitialCondition("");
    setEditingStartNodePath(null);
    setDeleteMentionOnCreate(false);
  }, []);

  const openForCreate = useCallback((options = {}) => {
    const { deleteMention = false } = options;

    resetModalState();
    setDeleteMentionOnCreate(Boolean(deleteMention));
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
        const updated = patchSelectedIfFunctionStartCondition(
          activeEditor,
          condition,
        );

        if (!updated) {
          patchIfFunctionStartConditionAtPath(
            activeEditor,
            editingStartNodePath,
            condition,
          );
        }
      } else {
        insertIfFunction(
          condition,
          DEFAULT_IF_BODY_TEXT,
          deleteMentionOnCreate,
        );
      }

      closeAndReset();
    },
    [
      activeEditor,
      closeAndReset,
      deleteMentionOnCreate,
      editingStartNodePath,
      insertIfFunction,
      mode,
    ],
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
