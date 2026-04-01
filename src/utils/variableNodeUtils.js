import { VARIABLE_ELEMENT_TYPE, VARIABLE_TOKEN_CONFIG } from "../config/editorConfig";

/**
 * 创建变量节点
 * @param {string} key - 变量的 key（如 "name"）
 * @returns {Object} Slate 变量节点对象
 */
export const createVariableNode = (key) => {
  if (!key) {
    throw new Error("Variable key is required");
  }

  // 构建显示文本
  const displayText = `${VARIABLE_TOKEN_CONFIG.prefix}${key}${VARIABLE_TOKEN_CONFIG.suffix}`;

  return {
    type: VARIABLE_ELEMENT_TYPE,
    key,
    children: [{ text: displayText }],
  };
};

/**
 * 判断节点是否为变量节点
 * @param {Object} node - Slate 节点
 * @returns {boolean}
 */
export const isVariableNode = (node) => {
  return node && node.type === VARIABLE_ELEMENT_TYPE;
};
