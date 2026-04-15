import { SlateEditor, SlateTransforms } from "@wangeditor/editor";
import { isVariableNode } from "../node-utils";
import { EMPTY_VALUE } from "./constants";
import { mergeVariableStyles } from "../shared-style";

/**
 * 获取当前选中的 variable 节点与 path。
 */
export const getSelectedVariableEntry = (editor) => {
  if (!editor?.selection) {
    return null;
  }

  const entry = SlateEditor.above(editor, {
    match: (node) => isVariableNode(node),
    at: editor.selection,
  });

  if (!entry) {
    return null;
  }

  const [node, path] = entry;
  return [node, path];
};

/**
 * 仅更新当前选中 variable 节点样式。
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
 * 读取当前选中 variable 节点样式值，未选中返回 fallback。
 */
export const readStyleValue = (editor, styleKey, fallback = EMPTY_VALUE) => {
  const entry = getSelectedVariableEntry(editor);
  if (!entry) {
    return fallback;
  }

  const [node] = entry;
  return node[styleKey] ?? fallback;
};

/**
 * 当前是否未选中 variable 节点，用于菜单禁用态判断。
 */
export const isVariableSelectionDisabled = (editor) => !getSelectedVariableEntry(editor);

/**
 * 兼容内置 list：string 或 { name, value }。
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

/**
 * 读取内置菜单配置列表（字号/字体等）。
 */
export const getConfigList = (editor, menuKey, listKey) => {
  const value = getMenuConfig(editor, menuKey)[listKey];
  return Array.isArray(value) ? value : [];
};

/**
 * 读取内置菜单颜色列表。
 */
export const getColorList = (editor, menuKey) => {
  const value = getMenuConfig(editor, menuKey).colors;
  return Array.isArray(value) ? value : [];
};
