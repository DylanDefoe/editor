import {
  IF_FUNCTION_END_ELEMENT_TYPE,
  IF_FUNCTION_START_ELEMENT_TYPE,
} from "../../config/editorConfig";

/**
 * 规整 condition 文本，避免解析出脏值。
 */
const normalizeCondition = (condition) => {
  return typeof condition === "string" ? condition.trim() : "";
};

/**
 * ifFunction HTML 解析配置：分别解析 start/end。
 */
const parseElemHtmlConfs = [
  {
    selector: `span[data-w-e-type="${IF_FUNCTION_START_ELEMENT_TYPE}"]`,
    parseElemHtml: (domElem) => {
      const condition = normalizeCondition(domElem.getAttribute("data-condition"));

      if (!condition) {
        return null;
      }

      return {
        type: IF_FUNCTION_START_ELEMENT_TYPE,
        condition,
        children: [{ text: "" }],
      };
    },
  },
  {
    selector: `span[data-w-e-type="${IF_FUNCTION_END_ELEMENT_TYPE}"]`,
    parseElemHtml: () => {
      return {
        type: IF_FUNCTION_END_ELEMENT_TYPE,
        children: [{ text: "" }],
      };
    },
  },
];

export default parseElemHtmlConfs;
