import { Boot, DomEditor } from "@wangeditor/editor";
import {
  IF_FUNCTION_START_ELEMENT_TYPE,
  IF_FUNCTION_END_ELEMENT_TYPE,
} from "../config/editorConfig";
import {
  isIfFunctionStartNode,
  isIfFunctionEndNode,
} from "../utils/ifFunctionNodeUtils";
import { VARIABLE_BASE_STYLE } from "./variableStyleHelpers";

const SELECTED_BORDER_STYLE = "2px solid #B4D5FF";
const UNSELECTED_BORDER_STYLE = "2px solid transparent";
const IF_FUNCTION_TEXT = Object.freeze({
  end: "{{/}}",
});

const normalizeCondition = (condition) => {
  return typeof condition === "string" ? condition.trim() : "";
};

const createIfFunctionStartText = (condition) => `{{? ${condition} }}`;
const createIfFunctionEndText = () => IF_FUNCTION_TEXT.end;

const createIfFunctionStyle = (selected) => {
  return {
    ...VARIABLE_BASE_STYLE,
    border: selected ? SELECTED_BORDER_STYLE : UNSELECTED_BORDER_STYLE,
  };
};

const createIfFunctionVNode = (elemNode, children, editor) => {
  const isStartNode = isIfFunctionStartNode(elemNode);
  const condition = isStartNode ? normalizeCondition(elemNode.condition) : "";
  const selected = DomEditor.isNodeSelected(editor, elemNode);

  const childrenArray = [
    {
      text: isStartNode
        ? createIfFunctionStartText(condition)
        : createIfFunctionEndText(),
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
      style: createIfFunctionStyle(selected),
    },
    children: childrenArray,
  };
};

/**
 * 注册函数标签 start/end 元素的渲染、序列化和编辑器行为。
 */
export function registerIfFunctionElements() {
  Boot.registerRenderElem({
    type: IF_FUNCTION_START_ELEMENT_TYPE,
    renderElem: createIfFunctionVNode,
  });

  Boot.registerRenderElem({
    type: IF_FUNCTION_END_ELEMENT_TYPE,
    renderElem: createIfFunctionVNode,
  });

  Boot.registerElemToHtml({
    type: IF_FUNCTION_START_ELEMENT_TYPE,
    elemToHtml: (elemNode) => {
      const condition = normalizeCondition(elemNode.condition);

      if (!condition) {
        return "";
      }

      return `<span data-w-e-type="${IF_FUNCTION_START_ELEMENT_TYPE}" data-condition="${condition}" contenteditable="false">${createIfFunctionStartText(condition)}</span>`;
    },
  });

  Boot.registerElemToHtml({
    type: IF_FUNCTION_END_ELEMENT_TYPE,
    elemToHtml: () => {
      return `<span data-w-e-type="${IF_FUNCTION_END_ELEMENT_TYPE}" contenteditable="false">${createIfFunctionEndText()}</span>`;
    },
  });

  Boot.registerParseElemHtml({
    selector: `span[data-w-e-type="${IF_FUNCTION_START_ELEMENT_TYPE}"]`,
    parseElemHtml: (domElem) => {
      const condition = normalizeCondition(domElem.getAttribute("data-condition"));

      if (!condition) {
        return null;
      }

      return {
        type: IF_FUNCTION_START_ELEMENT_TYPE,
        condition,
        children: [{ text: "" }],
      };
    },
  });

  Boot.registerParseElemHtml({
    selector: `span[data-w-e-type="${IF_FUNCTION_END_ELEMENT_TYPE}"]`,
    parseElemHtml: () => {
      return {
        type: IF_FUNCTION_END_ELEMENT_TYPE,
        children: [{ text: "" }],
      };
    },
  });

  Boot.registerPlugin((editor) => {
    const { isInline, isVoid } = editor;

    editor.isInline = (element) => {
      return (
        isIfFunctionStartNode(element) ||
        isIfFunctionEndNode(element) ||
        isInline(element)
      );
    };

    editor.isVoid = (element) => {
      return (
        isIfFunctionStartNode(element) ||
        isIfFunctionEndNode(element) ||
        isVoid(element)
      );
    };

    return editor;
  });
}
