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
