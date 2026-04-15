import { EMPTY_VALUE } from "./menu/constants";

// 变量节点基础样式：保证插入后不可选中编辑。
export const VARIABLE_BASE_STYLE = Object.freeze({
  userSelect: "none",
});

// 清空样式菜单使用的样式重置补丁。
export const EMPTY_VARIABLE_STYLE_PATCH = Object.freeze({
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  color: "",
  backgroundColor: "",
  fontSize: "",
  fontFamily: "",
});

/**
 * 规整变量样式字段，避免脏值进入渲染与序列化流程。
 */
export const pickVariableStyles = (node = {}) => {
  return {
    bold: !!node.bold,
    italic: !!node.italic,
    underline: !!node.underline,
    strikeThrough: !!node.strikeThrough,
    color: node.color || "",
    backgroundColor: node.backgroundColor || "",
    fontSize: node.fontSize || "",
    fontFamily: node.fontFamily || "",
  };
};

/**
 * 合并变量样式：保留当前值，仅覆盖 patch 中传入字段。
 */
export const mergeVariableStyles = (node = {}, patch = {}) => {
  const current = pickVariableStyles(node);
  return {
    ...current,
    ...patch,
  };
};

/**
 * 将变量样式字段转换为可渲染的 style 对象。
 */
export const buildVariableStyleObject = (node = {}) => {
  const styles = pickVariableStyles(node);
  const styleObject = {};

  if (styles.bold) {
    styleObject.fontWeight = "700";
  }
  if (styles.italic) {
    styleObject.fontStyle = "italic";
  }

  const textDecoration = [
    styles.underline ? "underline" : "",
    styles.strikeThrough ? "line-through" : "",
  ]
    .filter(Boolean)
    .join(" ");
  if (textDecoration) {
    styleObject.textDecoration = textDecoration;
  }

  if (styles.color) styleObject.color = styles.color;
  if (styles.backgroundColor) styleObject.backgroundColor = styles.backgroundColor;
  if (styles.fontSize) styleObject.fontSize = styles.fontSize;
  if (styles.fontFamily) styleObject.fontFamily = styles.fontFamily;

  return styleObject;
};

/**
 * 把 style 对象序列化为 CSS 字符串。
 */
export const styleObjectToCssText = (styleObject = {}) => {
  return Object.entries(styleObject)
    .map(([prop, value]) => {
      const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${cssProp}: ${value}`;
    })
    .join("; ");
};

/**
 * 从 DOM 反解析变量样式字段。
 */
export const parseVariableStyleFromDom = (domElem) => {
  return {
    bold: ["700", "bold"].includes(domElem.style.fontWeight),
    italic: domElem.style.fontStyle === "italic",
    underline: domElem.style.textDecorationLine.includes("underline"),
    strikeThrough: domElem.style.textDecorationLine.includes("line-through"),
    color: domElem.style.color || EMPTY_VALUE,
    backgroundColor: domElem.style.backgroundColor || EMPTY_VALUE,
    fontSize: domElem.style.fontSize || EMPTY_VALUE,
    fontFamily: domElem.style.fontFamily || EMPTY_VALUE,
  };
};
