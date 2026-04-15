import { VARIABLE_ELEMENT_TYPE } from "../../config/editorConfig";
import {
  mergeVariableStyles,
  parseVariableStyleFromDom,
  VARIABLE_BASE_STYLE,
} from "./shared-style";

/**
 * variable HTML 解析器：把 span[data-w-e-type="variable"] 反解析为 Slate 节点。
 */
function parseVariableElemHtml(domElem) {
  const key = domElem.getAttribute("data-variable-key");

  if (!key) {
    return null;
  }

  const stylePatch = parseVariableStyleFromDom(domElem);
  return {
    type: VARIABLE_ELEMENT_TYPE,
    key,
    style: { ...VARIABLE_BASE_STYLE },
    ...mergeVariableStyles({}, stylePatch),
    children: [{ text: "" }],
  };
}

const parseElemHtmlConf = {
  selector: `span[data-w-e-type="${VARIABLE_ELEMENT_TYPE}"]`,
  parseElemHtml: parseVariableElemHtml,
};

export default parseElemHtmlConf;
