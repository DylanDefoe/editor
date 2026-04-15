import { DomEditor } from "@wangeditor/editor";
import {
  IF_FUNCTION_END_ELEMENT_TYPE,
  IF_FUNCTION_START_ELEMENT_TYPE,
} from "../../config/editorConfig";
import { isIfFunctionStartNode } from "./node-utils";
import { VARIABLE_BASE_STYLE } from "../variable/shared-style";

const SELECTED_BORDER_STYLE = "2px solid #B4D5FF";
const UNSELECTED_BORDER_STYLE = "2px solid transparent";
const IF_FUNCTION_END_TEXT = "{{/}}";

/**
 * 规整 condition 文本，避免渲染脏值。
 */
const normalizeCondition = (condition) => {
  return typeof condition === "string" ? condition.trim() : "";
};

const createIfFunctionStartText = (condition) => `{{? ${condition} }}`;

/**
 * ifFunction 节点渲染器：统一渲染 start/end 两种节点。
 */
function renderIfFunctionElem(elemNode, children, editor) {
  const isStartNode = isIfFunctionStartNode(elemNode);
  const condition = isStartNode ? normalizeCondition(elemNode.condition) : "";
  const selected = DomEditor.isNodeSelected(editor, elemNode);

  const childrenArray = [
    {
      text: isStartNode ? createIfFunctionStartText(condition) : IF_FUNCTION_END_TEXT,
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
      style: {
        ...VARIABLE_BASE_STYLE,
        border: selected ? SELECTED_BORDER_STYLE : UNSELECTED_BORDER_STYLE,
      },
    },
    children: childrenArray,
  };
}

const renderElemConfs = [
  {
    type: IF_FUNCTION_START_ELEMENT_TYPE,
    renderElem: renderIfFunctionElem,
  },
  {
    type: IF_FUNCTION_END_ELEMENT_TYPE,
    renderElem: renderIfFunctionElem,
  },
];

export default renderElemConfs;
