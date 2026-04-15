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

export const VARIABLE_PRESETS = [
  {
    type: VARIABLE_PRESET_TYPE,
    value: "name",
    label: "姓名",
  },
  {
    type: VARIABLE_PRESET_TYPE,
    value: "age",
    label: "年龄",
  },
  {
    type: VARIABLE_PRESET_TYPE,
    value: "gender",
    label: "性别",
  },
  {
    type: VARIABLE_PRESET_TYPE,
    value: "location",
    label: "居住地",
  },
  {
    type: IF_FUNCTION_PRESET_TYPE,
    value: "if function",
    label: "IF函数",
  },
  {
    type: JOIN_FUNCTION_PRESET_TYPE,
    value: "join function",
    label: "JOIN函数",
  },
  {
    type: LOOP_FUNCTION_PRESET_TYPE,
    value: "loop function",
    label: "LOOP函数",
  },
];
