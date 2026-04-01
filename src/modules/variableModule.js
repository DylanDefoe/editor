/**
 * 变量元素模块配置
 * 用于在 wangEditor 中注册自定义变量元素
 */
import { Boot } from "@wangeditor/editor";
import {
  VARIABLE_ELEMENT_TYPE,
  VARIABLE_TOKEN_CONFIG,
} from "../config/editorConfig";
import { isVariableNode } from "../utils/variableNodeUtils";
import {
  buildVariableStyleObject,
  mergeVariableStyles,
  parseVariableStyleFromDom,
  styleObjectToCssText,
  VARIABLE_BASE_STYLE,
} from "./variableStyleHelpers";

/**
 * 创建变量显示文本
 */
const createVariableDisplayText = (key) => {
  return `${VARIABLE_TOKEN_CONFIG.prefix}${key}${VARIABLE_TOKEN_CONFIG.suffix}`;
};

/**
 * 创建变量元素的 VNode
 */
const createVariableVNode = (elemNode, children) => {
  const { key = "" } = elemNode;
  const childrenArray = [{ text: createVariableDisplayText(key) }];

  // 保留 Slate 传入的 children（如果存在）
  if (children) {
    childrenArray.push(children);
  }

  const vNode = {
    attrs: {
      "data-w-e-type": VARIABLE_ELEMENT_TYPE,
      "data-variable-key": key,
      contenteditable: "false",
    },
    style: {
      ...VARIABLE_BASE_STYLE,
      ...buildVariableStyleObject(elemNode),
    },
  };

  return {
    sel: "span",
    data: vNode,
    children: childrenArray,
  };
};

/**
 * 注册变量元素
 */
function registerVariableElement() {
  // 注册渲染器
  Boot.registerRenderElem({
    type: VARIABLE_ELEMENT_TYPE,
    renderElem: (elemNode, children) => {
      return createVariableVNode(elemNode, children);
    },
  });

  // 注册 HTML 序列化：将变量节点转换为 HTML
  Boot.registerElemToHtml({
    type: VARIABLE_ELEMENT_TYPE,
    elemToHtml: (elemNode) => {
      const { key = "" } = elemNode;
      const displayText = createVariableDisplayText(key);
      const cssText = styleObjectToCssText({
        ...VARIABLE_BASE_STYLE,
        ...buildVariableStyleObject(elemNode),
      });

      // 返回 HTML 字符串，同时保存 data-w-e-type 和 data-variable-key；变量始终保留 user-select:none
      return `<span data-w-e-type="${VARIABLE_ELEMENT_TYPE}" data-variable-key="${key}" contenteditable="false" style="${cssText}">${displayText}</span>`;
    },
  });

  // 注册 HTML 解析：将 HTML 转换回变量节点
  Boot.registerParseElemHtml({
    selector: `span[data-w-e-type="${VARIABLE_ELEMENT_TYPE}"]`, // 匹配 data-w-e-type 为 VARIABLE_ELEMENT_TYPE 的 span
    parseElemHtml: (domElem) => {
      const key = domElem.getAttribute("data-variable-key");

      if (!key) {
        return null;
      }

      // 从 HTML style 中回读变量样式，确保复制/回填时样式不丢失。
      const stylePatch = parseVariableStyleFromDom(domElem);
      const node = {
        type: VARIABLE_ELEMENT_TYPE,
        key,
        style: { ...VARIABLE_BASE_STYLE },
        ...mergeVariableStyles({}, stylePatch),
        children: [{ text: "" }],
      };

      return node;
    },
  });

  // 注册插件：覆写 isInline 和 isVoid
  Boot.registerPlugin((editor) => {
    const { isInline, isVoid } = editor;

    // 标记变量为 inline 元素
    editor.isInline = (element) => {
      return isVariableNode(element) || isInline(element);
    };

    // 标记变量为 void 元素（不可编辑内容）
    editor.isVoid = (element) => {
      return isVariableNode(element) || isVoid(element);
    };

    return editor;
  });
}

export { registerVariableElement };
