import { DomEditor } from "@wangeditor/editor";
import { VARIABLE_ELEMENT_TYPE } from "../../config/variable";
import { buildVariableStyleObject, VARIABLE_BASE_STYLE } from "./shared-style";

/**
 * 生成变量显示文本
 */
const createVariableDisplayText = (key) => {
  return `{{${key}}}`;
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
