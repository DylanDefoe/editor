import {
  IF_FUNCTION_END_ELEMENT_TYPE,
  IF_FUNCTION_START_ELEMENT_TYPE,
} from "../../config/editorConfig";

/**
 * 规整 condition 文本，避免写入脏值。
 */
const normalizeCondition = (condition) => {
  return typeof condition === "string" ? condition.trim() : "";
};

const createIfFunctionStartText = (condition) => `{{? ${condition} }}`;
const createIfFunctionEndText = () => "{{/}}";

/**
 * ifFunction 节点序列化配置：分别处理 start/end。
 */
const elemToHtmlConfs = [
  {
    type: IF_FUNCTION_START_ELEMENT_TYPE,
    elemToHtml: (elemNode) => {
      const condition = normalizeCondition(elemNode.condition);

      if (!condition) {
        return "";
      }

      return `<span data-w-e-type="${IF_FUNCTION_START_ELEMENT_TYPE}" data-condition="${condition}" contenteditable="false">${createIfFunctionStartText(condition)}</span>`;
    },
  },
  {
    type: IF_FUNCTION_END_ELEMENT_TYPE,
    elemToHtml: () => {
      return `<span data-w-e-type="${IF_FUNCTION_END_ELEMENT_TYPE}" contenteditable="false">${createIfFunctionEndText()}</span>`;
    },
  },
];

export default elemToHtmlConfs;
