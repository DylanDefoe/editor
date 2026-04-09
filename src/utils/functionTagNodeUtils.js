import { SlateEditor, SlateTransforms } from "@wangeditor/editor";
import {
  FUNCTION_TAG_START_ELEMENT_TYPE,
  FUNCTION_TAG_END_ELEMENT_TYPE,
} from "../config/editorConfig";

/**
 * 创建函数标签开始节点
 * @param {string} condition - 函数标签条件表达式
 * @returns {Object} Slate 函数标签开始节点对象
 */
export const createFunctionTagStartNode = (condition) => {
  if (typeof condition !== "string") {
    throw new Error("Function tag condition is required");
  }

  const trimmedCondition = condition.trim();

  if (!trimmedCondition) {
    throw new Error("Function tag condition is required");
  }

  return {
    type: FUNCTION_TAG_START_ELEMENT_TYPE,
    condition: trimmedCondition,
    children: [{ text: "" }],
  };
};

/**
 * 创建函数标签结束节点
 * @returns {Object} Slate 函数标签结束节点对象
 */
export const createFunctionTagEndNode = () => {
  return {
    type: FUNCTION_TAG_END_ELEMENT_TYPE,
    children: [{ text: "" }],
  };
};

/**
 * 判断节点是否为函数标签开始节点
 * @param {Object} node - Slate 节点
 * @returns {boolean}
 */
export const isFunctionTagStartNode = (node) => {
  return Boolean(node && node.type === FUNCTION_TAG_START_ELEMENT_TYPE);
};

/**
 * 判断节点是否为函数标签结束节点
 * @param {Object} node - Slate 节点
 * @returns {boolean}
 */
export const isFunctionTagEndNode = (node) => {
  return Boolean(node && node.type === FUNCTION_TAG_END_ELEMENT_TYPE);
};

const normalizeCondition = (condition) => {
  return typeof condition === "string" ? condition.trim() : "";
};

/**
 * 获取当前选中的函数标签开始节点和 path
 * @param {Object} editor - wangEditor / Slate editor 实例
 * @returns {[Object, Array] | null}
 */
export const getSelectedFunctionTagStartEntry = (editor) => {
  if (!editor?.selection) {
    return null;
  }

  const entry = SlateEditor.above(editor, {
    match: (node) => isFunctionTagStartNode(node),
    at: editor.selection,
  });

  return entry || null;
};

/**
 * 按 path 更新函数标签开始节点 condition
 * @param {Object} editor - wangEditor / Slate editor 实例
 * @param {Array} path - 节点 path
 * @param {string} condition - 条件表达式
 * @returns {boolean}
 */
export const patchFunctionTagStartConditionAtPath = (editor, path, condition) => {
  const normalizedCondition = normalizeCondition(condition);

  if (!editor || !Array.isArray(path) || !normalizedCondition) {
    return false;
  }

  SlateTransforms.setNodes(
    editor,
    {
      condition: normalizedCondition,
    },
    { at: path },
  );

  return true;
};

/**
 * 更新当前选中的函数标签开始节点 condition
 * @param {Object} editor - wangEditor / Slate editor 实例
 * @param {string} condition - 条件表达式
 * @returns {boolean}
 */
export const patchSelectedFunctionTagStartCondition = (editor, condition) => {
  const entry = getSelectedFunctionTagStartEntry(editor);

  if (!entry) {
    return false;
  }

  const [, path] = entry;
  return patchFunctionTagStartConditionAtPath(editor, path, condition);
};
