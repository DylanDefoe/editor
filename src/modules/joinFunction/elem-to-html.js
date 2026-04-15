import { JOIN_FUNCTION_ELEMENT_TYPE } from "../../config/variable";
import {
  buildVariableStyleObject,
  styleObjectToCssText,
  VARIABLE_BASE_STYLE,
} from "../variable/shared-style";

/**
 * 生成 JOIN 函数显示文本。
 */
const createJoinDisplayText = (variableName, separator) => {
  return `{{? join(${variableName},'${separator}')}}`;
};

/**
 * joinFunction 节点序列化配置。
 */
const elemToHtmlConf = {
  type: JOIN_FUNCTION_ELEMENT_TYPE,
  elemToHtml: (elemNode) => {
    const variableName = String(elemNode.variableName || "").trim();
    const separator = String(elemNode.separator || "");

    if (!variableName) {
      return "";
    }

    const cssText = styleObjectToCssText({
      ...VARIABLE_BASE_STYLE,
      ...buildVariableStyleObject(elemNode),
    });

    return `<span data-w-e-type="${JOIN_FUNCTION_ELEMENT_TYPE}" data-variable-name="${variableName}" data-separator="${separator}" contenteditable="false" style="${cssText}">${createJoinDisplayText(variableName, separator)}</span>`;
  },
};

export default elemToHtmlConf;
