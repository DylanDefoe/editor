import { SlateEditor, SlateTransforms } from "@wangeditor/editor";
import {
  IF_FUNCTION_START_ELEMENT_TYPE,
  IF_FUNCTION_END_ELEMENT_TYPE,
} from "../../config/variable";

/**
 * 创建函数标签开始节点
 * @param {string} condition - 函数标签条件表达式
 * @returns {Object} Slate 函数标签开始节点对象
 */
export const createIfFunctionStartNode = (condition) => {
  if (typeof condition !== "string") {
    throw new Error("Function tag condition is required");
  }

  const trimmedCondition = condition.trim();

  if (!trimmedCondition) {
    throw new Error("Function tag condition is required");
  }

  return {
    type: IF_FUNCTION_START_ELEMENT_TYPE,
    condition: trimmedCondition,
    children: [{ text: "" }],
  };
};

/**
 * 创建函数标签结束节点
 * @returns {Object} Slate 函数标签结束节点对象
 */
export const createIfFunctionEndNode = () => {
  return {
    type: IF_FUNCTION_END_ELEMENT_TYPE,
    children: [{ text: "" }],
  };
};

/**
 * 判断节点是否为函数标签开始节点
 * @param {Object} node - Slate 节点
 * @returns {boolean}
 */
export const isIfFunctionStartNode = (node) => {
  return Boolean(node && node.type === IF_FUNCTION_START_ELEMENT_TYPE);
};

/**
 * 判断节点是否为函数标签结束节点
 * @param {Object} node - Slate 节点
 * @returns {boolean}
 */
export const isIfFunctionEndNode = (node) => {
  return Boolean(node && node.type === IF_FUNCTION_END_ELEMENT_TYPE);
};

/**
 * 归一化 condition 字符串，避免写入脏值。
 */
const normalizeCondition = (condition) => {
  return typeof condition === "string" ? condition.trim() : "";
};

/**
 * 获取当前选中的函数标签开始节点和 path
 * @param {Object} editor - wangEditor / Slate editor 实例
 * @returns {[Object, Array] | null}
 */
export const getSelectedIfFunctionStartEntry = (editor) => {
  if (!editor?.selection) {
    return null;
  }

  const entry = SlateEditor.above(editor, {
    match: (node) => isIfFunctionStartNode(node),
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
export const patchIfFunctionStartConditionAtPath = (editor, path, condition) => {
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
export const patchSelectedIfFunctionStartCondition = (editor, condition) => {
  const entry = getSelectedIfFunctionStartEntry(editor);

  if (!entry) {
    return false;
  }

  const [, path] = entry;
  return patchIfFunctionStartConditionAtPath(editor, path, condition);
};
