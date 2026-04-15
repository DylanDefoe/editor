import { useCallback, useState } from "react";
import {
  patchJoinFunctionAtPath,
  patchSelectedJoinFunction,
} from "../modules/joinFunction/node-utils";

const JOIN_MODAL_MODE = Object.freeze({
  create: "create",
  edit: "edit",
});

/**
 * 管理 JOIN 条件弹窗的 create/edit 状态，并统一保存分流逻辑。
 */
function useJoinFunctionModalController({ activeEditor, insertJoinFunction }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(JOIN_MODAL_MODE.create);
  const [initialValues, setInitialValues] = useState({
    variableName: "",
    separator: "",
  });
  const [editingPath, setEditingPath] = useState(null);
  const [deleteMentionOnCreate, setDeleteMentionOnCreate] = useState(false);

  const resetModalState = useCallback(() => {
    setMode(JOIN_MODAL_MODE.create);
    setInitialValues({
      variableName: "",
      separator: "",
    });
    setEditingPath(null);
    setDeleteMentionOnCreate(false);
  }, []);

  const openForCreate = useCallback((options = {}) => {
    const { deleteMention = false } = options;

    resetModalState();
    setDeleteMentionOnCreate(Boolean(deleteMention));
    setOpen(true);
  }, [resetModalState]);

  const openForEdit = useCallback((values, path) => {
    const normalizedVariableName = String(values?.variableName || "").trim();
    if (!normalizedVariableName) {
      return;
    }

    setMode(JOIN_MODAL_MODE.edit);
    setInitialValues({
      variableName: normalizedVariableName,
      separator: String(values?.separator || ""),
    });
    setEditingPath(path);
    setOpen(true);
  }, []);

  const closeAndReset = useCallback(() => {
    setOpen(false);
    resetModalState();
  }, [resetModalState]);

  const saveValues = useCallback(
    ({ variableName, separator }) => {
      const payload = {
        variableName: String(variableName || "").trim(),
        separator: String(separator || ""),
      };
      if (!payload.variableName) {
        return;
      }

      if (mode === JOIN_MODAL_MODE.edit) {
        const updated = patchSelectedJoinFunction(activeEditor, payload);
        if (!updated) {
          patchJoinFunctionAtPath(activeEditor, editingPath, payload);
        }
      } else {
        insertJoinFunction(payload, deleteMentionOnCreate);
      }

      closeAndReset();
    },
    [
      activeEditor,
      closeAndReset,
      deleteMentionOnCreate,
      editingPath,
      insertJoinFunction,
      mode,
    ],
  );

  return {
    open,
    initialValues,
    openForCreate,
    openForEdit,
    closeAndReset,
    saveValues,
  };
}

export default useJoinFunctionModalController;

