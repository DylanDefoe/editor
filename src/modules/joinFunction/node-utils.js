import { SlateEditor, SlateTransforms } from "@wangeditor/editor";
import { JOIN_FUNCTION_ELEMENT_TYPE } from "../../config/editorConfig";

/**
 * 规整 join 参数，避免写入脏值。
 */
const normalizeJoinArgs = ({ variableName, separator }) => {
  return {
    variableName: (variableName || "").trim(),
    separator: separator || "",
  };
};

/**
 * 创建 JOIN 函数节点。
 */
export const createJoinFunctionNode = (variableName, separator) => {
  const normalized = normalizeJoinArgs({ variableName, separator });
  if (!normalized.variableName) {
    throw new Error("Join function variable name is required");
  }

  return {
    type: JOIN_FUNCTION_ELEMENT_TYPE,
    ...normalized,
    children: [{ text: "" }],
  };
};

/**
 * 判断节点是否为 JOIN 函数节点。
 */
export const isJoinFunctionNode = (node) => {
  return node && node.type === JOIN_FUNCTION_ELEMENT_TYPE;
};

/**
 * 获取当前选中的 JOIN 函数节点和 path。
 */
export const getSelectedJoinFunctionEntry = (editor) => {
  if (!editor?.selection) {
    return null;
  }

  const entry = SlateEditor.above(editor, {
    match: (node) => isJoinFunctionNode(node),
    at: editor.selection,
  });

  return entry || null;
};

/**
 * 按 path 更新 JOIN 节点参数。
 */
export const patchJoinFunctionAtPath = (
  editor,
  path,
  { variableName, separator },
) => {
  const normalized = normalizeJoinArgs({ variableName, separator });
  if (!editor || !Array.isArray(path) || !normalized.variableName) {
    return false;
  }

  SlateTransforms.setNodes(
    editor,
    {
      variableName: normalized.variableName,
      separator: normalized.separator,
    },
    { at: path },
  );

  return true;
};

/**
 * 更新当前选中 JOIN 节点参数。
 */
export const patchSelectedJoinFunction = (editor, args) => {
  const entry = getSelectedJoinFunctionEntry(editor);
  if (!entry) {
    return false;
  }

  const [, path] = entry;
  return patchJoinFunctionAtPath(editor, path, args);
};
