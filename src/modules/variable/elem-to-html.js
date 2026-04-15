import { VARIABLE_ELEMENT_TYPE } from "../../config/editorConfig";
import {
  buildVariableStyleObject,
  styleObjectToCssText,
  VARIABLE_BASE_STYLE,
} from "./shared-style";

/**
 * 生成变量显示文本
 */
const createVariableDisplayText = (key) => {
  return `{{${key}}}`;
};

/**
 * variable 节点序列化：输出带 data-w-e-type/data-variable-key 的 span。
 */
function variableElemToHtml(elemNode) {
  const { key = "" } = elemNode;
  const displayText = createVariableDisplayText(key);
  const cssText = styleObjectToCssText({
    ...VARIABLE_BASE_STYLE,
    ...buildVariableStyleObject(elemNode),
  });

  return `<span data-w-e-type="${VARIABLE_ELEMENT_TYPE}" data-variable-key="${key}" contenteditable="false" style="${cssText}">${displayText}</span>`;
}

const elemToHtmlConf = {
  type: VARIABLE_ELEMENT_TYPE,
  elemToHtml: variableElemToHtml,
};

export default elemToHtmlConf;
