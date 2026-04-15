import { DomEditor } from "@wangeditor/editor";
import { JOIN_FUNCTION_ELEMENT_TYPE } from "../../config/editorConfig";
import { VARIABLE_BASE_STYLE } from "../variable/shared-style";

const SELECTED_BORDER_STYLE = "2px solid #B4D5FF";
const UNSELECTED_BORDER_STYLE = "2px solid transparent";

/**
 * 生成 JOIN 函数显示文本。
 */
const createJoinDisplayText = (variableName, separator) => {
  return `{{? join(${variableName},'${separator}')}}`;
};

/**
 * joinFunction 节点渲染器。
 */
function renderJoinFunctionElem(elemNode, children, editor) {
  const variableName = String(elemNode.variableName || "").trim();
  const separator = String(elemNode.separator || "");
  const selected = DomEditor.isNodeSelected(editor, elemNode);

  const childrenArray = [
    {
      text: createJoinDisplayText(variableName, separator),
    },
  ];

  if (children) {
    childrenArray.push(children);
  }

  return {
    sel: "span",
    data: {
      attrs: {
        "data-w-e-type": JOIN_FUNCTION_ELEMENT_TYPE,
        "data-variable-name": variableName,
        "data-separator": separator,
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

const renderElemConf = {
  type: JOIN_FUNCTION_ELEMENT_TYPE,
  renderElem: renderJoinFunctionElem,
};

export default renderElemConf;

