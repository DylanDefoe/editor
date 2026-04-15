import {
  LOOP_FUNCTION_END_ELEMENT_TYPE,
  LOOP_FUNCTION_START_ELEMENT_TYPE,
} from "../../config/variable";

/**
 * loopFunction HTML 解析配置：分别解析 start/end。
 */
const parseElemHtmlConfs = [
  {
    selector: `span[data-w-e-type="${LOOP_FUNCTION_START_ELEMENT_TYPE}"]`,
    parseElemHtml: (domElem) => {
      const variableName = String(domElem.getAttribute("data-variable-name") || "").trim();
      if (!variableName) {
        return null;
      }

      return {
        type: LOOP_FUNCTION_START_ELEMENT_TYPE,
        variableName,
        children: [{ text: "" }],
      };
    },
  },
  {
    selector: `span[data-w-e-type="${LOOP_FUNCTION_END_ELEMENT_TYPE}"]`,
    parseElemHtml: (domElem) => {
      const variableName = String(domElem.getAttribute("data-variable-name") || "").trim();
      if (!variableName) {
        return null;
      }

      return {
        type: LOOP_FUNCTION_END_ELEMENT_TYPE,
        variableName,
        children: [{ text: "" }],
      };
    },
  },
];

export default parseElemHtmlConfs;
