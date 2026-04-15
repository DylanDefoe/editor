import { JOIN_FUNCTION_ELEMENT_TYPE } from "../../config/editorConfig";

/**
 * joinFunction HTML 解析配置。
 */
const parseElemHtmlConf = {
  selector: `span[data-w-e-type="${JOIN_FUNCTION_ELEMENT_TYPE}"]`,
  parseElemHtml: (domElem) => {
    const variableName = String(domElem.getAttribute("data-variable-name") || "").trim();
    const separator = String(domElem.getAttribute("data-separator") || "");

    if (!variableName) {
      return null;
    }

    return {
      type: JOIN_FUNCTION_ELEMENT_TYPE,
      variableName,
      separator,
      children: [{ text: "" }],
    };
  },
};

export default parseElemHtmlConf;

