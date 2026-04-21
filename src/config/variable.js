import { VARIABLE_CONFIG } from "./data";

export const VARIABLE_ELEMENT_TYPE = "variable";
export const IF_FUNCTION_START_ELEMENT_TYPE = "if-function-start";
export const IF_FUNCTION_END_ELEMENT_TYPE = "if-function-end";
export const LOOP_FUNCTION_START_ELEMENT_TYPE = "loop-function-start";
export const LOOP_FUNCTION_END_ELEMENT_TYPE = "loop-function-end";
export const JOIN_FUNCTION_ELEMENT_TYPE = "join-function";

export const VARIABLE_PRESET_TYPE = "variable-preset";
export const IF_FUNCTION_PRESET_TYPE = "if-function-preset";
export const LOOP_FUNCTION_PRESET_TYPE = "loop-function-preset";
export const JOIN_FUNCTION_PRESET_TYPE = "join-function-preset";

const FUNCTION_PRESET_TYPE_MAP = {
  ifFunc: IF_FUNCTION_PRESET_TYPE,
  loopFunc: LOOP_FUNCTION_PRESET_TYPE,
  joinFunc: JOIN_FUNCTION_PRESET_TYPE,
};

export const VARIABLE_PRESETS = VARIABLE_CONFIG.map((group) => {
  group.children?.forEach((item) => {
    item.type = FUNCTION_PRESET_TYPE_MAP[item.value] ?? VARIABLE_PRESET_TYPE;
  });
  return group;
});