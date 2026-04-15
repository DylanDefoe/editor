import { DomEditor } from "@wangeditor/editor";
import {
  VARIABLE_ELEMENT_TYPE,
  VARIABLE_TOKEN_CONFIG,
} from "../../config/editorConfig";
import { buildVariableStyleObject, VARIABLE_BASE_STYLE } from "./shared-style";

/**
 * 生成变量在编辑器中的展示文本（如 {{name}}）。
 */
const createVariableDisplayText = (key) => {
  return `${VARIABLE_TOKEN_CONFIG.prefix}${key}${VARIABLE_TOKEN_CONFIG.suffix}`;
};

/**
 * variable 节点渲染器：渲染为不可编辑 inline-void span。
 */
function renderVariableElem(elemNode, children, editor) {
  const { key = "" } = elemNode;
  const childrenArray = [{ text: createVariableDisplayText(key) }];

  if (children) {
    childrenArray.push(children);
  }

  const selected = DomEditor.isNodeSelected(editor, elemNode);

  return {
    sel: "span",
    data: {
      attrs: {
        "data-w-e-type": VARIABLE_ELEMENT_TYPE,
        "data-variable-key": key,
        contenteditable: "false",
      },
      style: {
        ...VARIABLE_BASE_STYLE,
        ...buildVariableStyleObject(elemNode),
        border: selected ? "2px solid #B4D5FF" : "2px solid transparent",
      },
    },
    children: childrenArray,
  };
}

const renderElemConf = {
  type: VARIABLE_ELEMENT_TYPE,
  renderElem: renderVariableElem,
};

export default renderElemConf;
