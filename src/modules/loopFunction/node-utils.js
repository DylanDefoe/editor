import { SlateEditor, SlateNode, SlateTransforms } from "@wangeditor/editor";
import {
  LOOP_FUNCTION_END_ELEMENT_TYPE,
  LOOP_FUNCTION_START_ELEMENT_TYPE,
} from "../../config/editorConfig";

/**
 * 规整 loop 变量名，避免写入脏值。
 */
const normalizeVariableName = (variableName) => {
  return (variableName || "").trim();
};

/**
 * 创建 LOOP 开始节点。
 */
export const createLoopFunctionStartNode = (variableName) => {
  const normalizedVariableName = normalizeVariableName(variableName);
  if (!normalizedVariableName) {
    throw new Error("Loop function variable name is required");
  }

  return {
    type: LOOP_FUNCTION_START_ELEMENT_TYPE,
    variableName: normalizedVariableName,
    children: [{ text: "" }],
  };
};

/**
 * 创建 LOOP 结束节点。
 */
export const createLoopFunctionEndNode = (variableName) => {
  const normalizedVariableName = normalizeVariableName(variableName);
  if (!normalizedVariableName) {
    throw new Error("Loop function variable name is required");
  }

  return {
    type: LOOP_FUNCTION_END_ELEMENT_TYPE,
    variableName: normalizedVariableName,
    children: [{ text: "" }],
  };
};

/**
 * 判断节点是否为 LOOP 开始节点。
 */
export const isLoopFunctionStartNode = (node) => {
  return node && node.type === LOOP_FUNCTION_START_ELEMENT_TYPE;
};

/**
 * 判断节点是否为 LOOP 结束节点。
 */
export const isLoopFunctionEndNode = (node) => {
  return node && node.type === LOOP_FUNCTION_END_ELEMENT_TYPE;
};

const isLoopFunctionNode = (node) => {
  return isLoopFunctionStartNode(node) || isLoopFunctionEndNode(node);
};

/**
 * 获取当前选中的 LOOP 节点和 path（支持 start/end）。
 */
export const getSelectedLoopFunctionEntry = (editor) => {
  if (!editor?.selection) {
    return null;
  }

  const entry = SlateEditor.above(editor, {
    match: (node) => isLoopFunctionNode(node),
    at: editor.selection,
  });

  return entry || null;
};

const tryGetNodeAtPath = (editor, path) => {
  try {
    return SlateNode.get(editor, path);
  } catch {
    return null;
  }
};

const patchNodeVariableAtPath = (editor, path, variableName) => {
  const node = tryGetNodeAtPath(editor, path);
  if (!isLoopFunctionNode(node)) {
    return false;
  }

  SlateTransforms.setNodes(
    editor,
    {
      variableName,
    },
    { at: path },
  );
  return true;
};

/**
 * 按 path 更新 LOOP 节点变量名，并尝试同步其配对节点。
 */
export const patchLoopFunctionVariableAtPath = (editor, path, variableName) => {
  const normalizedVariableName = normalizeVariableName(variableName);
  if (!editor || !Array.isArray(path) || !normalizedVariableName) {
    return false;
  }

  let patched = false;
  patched =
    patchNodeVariableAtPath(editor, path, normalizedVariableName) || patched;

  const parentPath = path.slice(0, -1);
  const index = path[path.length - 1];
  if (typeof index === "number" && parentPath.length >= 0) {
    patched =
      patchNodeVariableAtPath(
        editor,
        [...parentPath, index - 2],
        normalizedVariableName,
      ) || patched;
    patched =
      patchNodeVariableAtPath(
        editor,
        [...parentPath, index + 2],
        normalizedVariableName,
      ) || patched;
  }

  return patched;
};

/**
 * 更新当前选中的 LOOP 节点变量名（支持 start/end）。
 */
export const patchSelectedLoopFunctionVariable = (editor, variableName) => {
  const entry = getSelectedLoopFunctionEntry(editor);
  if (!entry) {
    return false;
  }

  const [, path] = entry;
  return patchLoopFunctionVariableAtPath(editor, path, variableName);
};
