import { DomEditor, SlateTransforms } from "@wangeditor/editor";
import { VARIABLE_ELEMENT_TYPE } from "../config/editorConfig";
import { isVariableNode } from "../utils/variableNodeUtils";
import { EMPTY_VALUE } from "./variableStyleConstants";

export const VARIABLE_BASE_STYLE = Object.freeze({
  userSelect: "none",
});

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
 * 获取当前选中的变量节点和 path，供菜单状态判断与 setNodes 使用。
 */
export const getSelectedVariableEntry = (editor) => {
  if (!editor?.selection) {
    return null;
  }
  const node = DomEditor.getSelectedNodeByType(editor, VARIABLE_ELEMENT_TYPE);
  if (!node || !isVariableNode(node)) {
    return null;
  }
  const path = DomEditor.findPath(editor, node);
  return path ? [node, path] : null;
};

/**
 * 只更新当前选中变量节点的样式字段，不会影响其他节点。
 */
export const patchSelectedVariableStyle = (editor, patch) => {
  const entry = getSelectedVariableEntry(editor);
  if (!entry) {
    return;
  }
  const [node, path] = entry;
  const nextPatch = mergeVariableStyles(node, patch);
  SlateTransforms.setNodes(editor, nextPatch, { at: path });
};

/**
 * 从变量节点读取样式值，未选中时返回 fallback。
 */
export const readStyleValue = (editor, styleKey, fallback = EMPTY_VALUE) => {
  const entry = getSelectedVariableEntry(editor);
  if (!entry) {
    return fallback;
  }
  const [node] = entry;
  return node[styleKey] ?? fallback;
};

export const isVariableSelectionDisabled = (editor) => !getSelectedVariableEntry(editor);

/**
 * 兼容内置 list 格式（string 或 {name, value}）。
 */
export const normalizeSelectOptions = (items = [], defaultLabel) => [
  { value: EMPTY_VALUE, text: defaultLabel },
  ...items
    .map((item) =>
      typeof item === "string"
        ? { value: item, text: item }
        : item?.value
          ? { value: item.value, text: item.name || item.value }
          : null,
    )
    .filter(Boolean),
];

const getMenuConfig = (editor, key) => editor.getMenuConfig(key) || {};

export const getConfigList = (editor, menuKey, listKey) => {
  const value = getMenuConfig(editor, menuKey)[listKey];
  return Array.isArray(value) ? value : [];
};

export const getColorList = (editor, menuKey) => {
  const value = getMenuConfig(editor, menuKey).colors;
  return Array.isArray(value) ? value : [];
};

/**
 * 规整变量样式字段，避免脏值进入序列化/渲染。
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
 * 合并变量样式：保留节点现值，仅覆盖 patch 中传入字段。
 */
export const mergeVariableStyles = (node = {}, patch = {}) => {
  const current = pickVariableStyles(node);
  return {
    ...current,
    ...patch,
  };
};

/**
 * 将变量节点样式转换为可序列化的 style 对象。
 * 仅输出已设置字段；插入时的 `user-select:none` 由变量创建流程负责，不在此处注入。
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

export const styleObjectToCssText = (styleObject = {}) => {
  return Object.entries(styleObject)
    .map(([prop, value]) => {
      const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${cssProp}: ${value}`;
    })
    .join("; ");
};

/**
 * 从 DOM style 反解析变量样式字段。
 */
export const parseVariableStyleFromDom = (domElem) => {
  return {
    bold: ["700", "bold"].includes(domElem.style.fontWeight),
    italic: domElem.style.fontStyle === "italic",
    underline: domElem.style.textDecorationLine.includes("underline"),
    strikeThrough: domElem.style.textDecorationLine.includes("line-through"),
    color: domElem.style.color || "",
    backgroundColor: domElem.style.backgroundColor || "",
    fontSize: domElem.style.fontSize || "",
    fontFamily: domElem.style.fontFamily || "",
  };
};
