import { DomEditor } from "@wangeditor/editor";
import {
  LOOP_FUNCTION_END_ELEMENT_TYPE,
  LOOP_FUNCTION_START_ELEMENT_TYPE,
} from "../../config/variable";
import {
  isLoopFunctionStartNode,
} from "./node-utils";
import { VARIABLE_BASE_STYLE } from "../variable/shared-style";

const SELECTED_BORDER_STYLE = "2px solid #B4D5FF";
const UNSELECTED_BORDER_STYLE = "2px solid transparent";

const createLoopStartText = (variableName) => `{{? ${variableName} }}`;
const createLoopEndText = (variableName) => `{{/${variableName}}}`;

/**
 * loopFunction 节点渲染器：统一渲染 start/end 两种节点。
 */
function renderLoopFunctionElem(elemNode, children, editor) {
  const variableName = String(elemNode.variableName || "").trim();
  const isStartNode = isLoopFunctionStartNode(elemNode);
  const selected = DomEditor.isNodeSelected(editor, elemNode);

  const childrenArray = [
    {
      text: isStartNode
        ? createLoopStartText(variableName)
        : createLoopEndText(variableName),
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
        "data-variable-name": variableName,
        contenteditable: "false",
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
    type: LOOP_FUNCTION_START_ELEMENT_TYPE,
    renderElem: renderLoopFunctionElem,
  },
  {
    type: LOOP_FUNCTION_END_ELEMENT_TYPE,
    renderElem: renderLoopFunctionElem,
  },
];

export default renderElemConfs;
