import { Boot, DomEditor } from "@wangeditor/editor";
import {
  FUNCTION_TAG_START_ELEMENT_TYPE,
  FUNCTION_TAG_END_ELEMENT_TYPE,
} from "../config/editorConfig";
import {
  isFunctionTagStartNode,
  isFunctionTagEndNode,
} from "../utils/functionTagNodeUtils";
import { VARIABLE_BASE_STYLE } from "./variableStyleHelpers";

const SELECTED_BORDER_STYLE = "2px solid #B4D5FF";
const UNSELECTED_BORDER_STYLE = "2px solid transparent";
const FUNCTION_TAG_TEXT = Object.freeze({
  end: "{{/}}",
});

const normalizeCondition = (condition) => {
  return typeof condition === "string" ? condition.trim() : "";
};

const escapeHtmlText = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const escapeHtmlAttribute = (value) => {
  return escapeHtmlText(value)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const createFunctionTagStartText = (condition) => `{{? ${condition} }}`;
const createFunctionTagEndText = () => FUNCTION_TAG_TEXT.end;

const createFunctionTagStyle = (selected) => {
  return {
    ...VARIABLE_BASE_STYLE,
    border: selected ? SELECTED_BORDER_STYLE : UNSELECTED_BORDER_STYLE,
  };
};

const createFunctionTagVNode = (elemNode, children, editor) => {
  const isStartNode = isFunctionTagStartNode(elemNode);
  const condition = isStartNode ? normalizeCondition(elemNode.condition) : "";
  const selected = DomEditor.isNodeSelected(editor, elemNode);

  const childrenArray = [
    {
      text: isStartNode
        ? createFunctionTagStartText(condition)
        : createFunctionTagEndText(),
    },
  ];

  if (children) {
    childrenArray.push(children);
  }

  return {
    sel: "span",
    data: {
      attrs: {
        "data-w-e-type": elemNode.type,
        contenteditable: "false",
        ...(isStartNode ? { "data-condition": condition } : {}),
      },
      style: createFunctionTagStyle(selected),
    },
    children: childrenArray,
  };
};

/**
 * 注册函数标签 start/end 元素的渲染、序列化和编辑器行为。
 */
export function registerFunctionTagElements() {
  Boot.registerRenderElem({
    type: FUNCTION_TAG_START_ELEMENT_TYPE,
    renderElem: createFunctionTagVNode,
  });

  Boot.registerRenderElem({
    type: FUNCTION_TAG_END_ELEMENT_TYPE,
    renderElem: createFunctionTagVNode,
  });

  Boot.registerElemToHtml({
    type: FUNCTION_TAG_START_ELEMENT_TYPE,
    elemToHtml: (elemNode) => {
      const condition = normalizeCondition(elemNode.condition);

      if (!condition) {
        return "";
      }

      const escapedCondition = escapeHtmlAttribute(condition);
      const displayText = escapeHtmlText(createFunctionTagStartText(condition));

      return `<span data-w-e-type="${FUNCTION_TAG_START_ELEMENT_TYPE}" data-condition="${escapedCondition}" contenteditable="false">${displayText}</span>`;
    },
  });

  Boot.registerElemToHtml({
    type: FUNCTION_TAG_END_ELEMENT_TYPE,
    elemToHtml: () => {
      return `<span data-w-e-type="${FUNCTION_TAG_END_ELEMENT_TYPE}" contenteditable="false">${createFunctionTagEndText()}</span>`;
    },
  });

  Boot.registerParseElemHtml({
    selector: `span[data-w-e-type="${FUNCTION_TAG_START_ELEMENT_TYPE}"]`,
    parseElemHtml: (domElem) => {
      const condition = normalizeCondition(domElem.getAttribute("data-condition"));

      if (!condition) {
        return null;
      }

      return {
        type: FUNCTION_TAG_START_ELEMENT_TYPE,
        condition,
        children: [{ text: "" }],
      };
    },
  });

  Boot.registerParseElemHtml({
    selector: `span[data-w-e-type="${FUNCTION_TAG_END_ELEMENT_TYPE}"]`,
    parseElemHtml: () => {
      return {
        type: FUNCTION_TAG_END_ELEMENT_TYPE,
        children: [{ text: "" }],
      };
    },
  });

  Boot.registerPlugin((editor) => {
    const { isInline, isVoid } = editor;

    editor.isInline = (element) => {
      return (
        isFunctionTagStartNode(element) ||
        isFunctionTagEndNode(element) ||
        isInline(element)
      );
    };

    editor.isVoid = (element) => {
      return (
        isFunctionTagStartNode(element) ||
        isFunctionTagEndNode(element) ||
        isVoid(element)
      );
    };

    return editor;
  });
}
