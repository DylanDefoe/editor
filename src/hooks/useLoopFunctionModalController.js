import { useCallback, useState } from "react";
import {
  patchLoopFunctionVariableAtPath,
  patchSelectedLoopFunctionVariable,
} from "../modules/loopFunction/node-utils";

const LOOP_MODAL_MODE = Object.freeze({
  create: "create",
  edit: "edit",
});

const DEFAULT_LOOP_BODY_TEXT = "需要展示的文案";

/**
 * 管理 LOOP 条件弹窗的 create/edit 状态，并统一保存分流逻辑。
 */
function useLoopFunctionModalController({ activeEditor, insertLoopFunction }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(LOOP_MODAL_MODE.create);
  const [initialVariableName, setInitialVariableName] = useState("");
  const [editingPath, setEditingPath] = useState(null);
  const [deleteMentionOnCreate, setDeleteMentionOnCreate] = useState(false);

  const resetModalState = useCallback(() => {
    setMode(LOOP_MODAL_MODE.create);
    setInitialVariableName("");
    setEditingPath(null);
    setDeleteMentionOnCreate(false);
  }, []);

  const openForCreate = useCallback((options = {}) => {
    const { deleteMention = false } = options;

    resetModalState();
    setDeleteMentionOnCreate(Boolean(deleteMention));
    setOpen(true);
  }, [resetModalState]);

  const openForEdit = useCallback((variableName, path) => {
    const normalizedVariableName = String(variableName || "").trim();
    if (!normalizedVariableName) {
      return;
    }

    setMode(LOOP_MODAL_MODE.edit);
    setInitialVariableName(normalizedVariableName);
    setEditingPath(path);
    setOpen(true);
  }, []);

  const closeAndReset = useCallback(() => {
    setOpen(false);
    resetModalState();
  }, [resetModalState]);

  const saveVariableName = useCallback(
    ({ variableName }) => {
      const normalizedVariableName = String(variableName || "").trim();
      if (!normalizedVariableName) {
        return;
      }

      if (mode === LOOP_MODAL_MODE.edit) {
        const updated = patchSelectedLoopFunctionVariable(
          activeEditor,
          normalizedVariableName,
        );
        if (!updated) {
          patchLoopFunctionVariableAtPath(
            activeEditor,
            editingPath,
            normalizedVariableName,
          );
        }
      } else {
        insertLoopFunction(
          normalizedVariableName,
          DEFAULT_LOOP_BODY_TEXT,
          deleteMentionOnCreate,
        );
      }

      closeAndReset();
    },
    [
      activeEditor,
      closeAndReset,
      deleteMentionOnCreate,
      editingPath,
      insertLoopFunction,
      mode,
    ],
  );

  return {
    open,
    initialVariableName,
    openForCreate,
    openForEdit,
    closeAndReset,
    saveVariableName,
  };
}

export default useLoopFunctionModalController;

