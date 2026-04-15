import {
  LOOP_FUNCTION_END_ELEMENT_TYPE,
  LOOP_FUNCTION_START_ELEMENT_TYPE,
} from "../../config/variable";

const createLoopStartText = (variableName) => `{{? ${variableName} }}`;
const createLoopEndText = (variableName) => `{{/${variableName}}}`;

/**
 * loopFunction 节点序列化配置：分别处理 start/end。
 */
const elemToHtmlConfs = [
  {
    type: LOOP_FUNCTION_START_ELEMENT_TYPE,
    elemToHtml: (elemNode) => {
      const variableName = String(elemNode.variableName || "").trim();
      if (!variableName) {
        return "";
      }

      return `<span data-w-e-type="${LOOP_FUNCTION_START_ELEMENT_TYPE}" data-variable-name="${variableName}" contenteditable="false">${createLoopStartText(variableName)}</span>`;
    },
  },
  {
    type: LOOP_FUNCTION_END_ELEMENT_TYPE,
    elemToHtml: (elemNode) => {
      const variableName = String(elemNode.variableName || "").trim();
      if (!variableName) {
        return "";
      }

      return `<span data-w-e-type="${LOOP_FUNCTION_END_ELEMENT_TYPE}" data-variable-name="${variableName}" contenteditable="false">${createLoopEndText(variableName)}</span>`;
    },
  },
];

export default elemToHtmlConfs;
