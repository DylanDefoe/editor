// 变量节点类型定义
export const VARIABLE_ELEMENT_TYPE = "variable";
export const IF_FUNCTION_START_ELEMENT_TYPE = "if-function-start";
export const IF_FUNCTION_END_ELEMENT_TYPE = "if-function-end";
export const LOOP_FUNCTION_START_ELEMENT_TYPE = "loop-function-start";
export const LOOP_FUNCTION_END_ELEMENT_TYPE = "loop-function-end";
export const JOIN_FUNCTION_ELEMENT_TYPE = "join-function";
export const VARIABLE_PRESET_ELEMENT_TYPE = "variable-preset";
export const IF_FUNCTION_PRESET_TYPE = "if-function-preset";
export const LOOP_FUNCTION_PRESET_TYPE = "loop-function-preset";
export const JOIN_FUNCTION_PRESET_TYPE = "join-function-preset";

export const VARIABLE_MENTION_CONFIG = {
  triggerChar: "@",
  searchPlaceholder: "搜索变量",
  dropdownWidth: 280,
};

export const EDITOR_DEFAULT_VALUE = `<p>这是一个基于 React + wangEditor<span data-w-e-type="variable" data-variable-key="age" contenteditable="false" style="user-select: none; font-weight: 700; font-style: italic; color: rgb(29, 57, 196); font-size: 19px; font-family: 标楷体">{{age}}</span>的基础富文本 Demo。</p><p>这是if函数 &nbsp;<span data-w-e-type="if-function-start" data-condition="age > 22" contenteditable="false">{{? age > 22 }}</span>需<span style="color: rgb(130, 0, 20);">要展示</span>的文案<span data-w-e-type="if-function-end" contenteditable="false">{{/}}</span></p><p>这是join函数 &nbsp;<span data-w-e-type="join-function" data-variable-name="name" data-separator="、" contenteditable="false" style="user-select: none; color: rgb(66, 144, 247)">{{? join(name,'、')}}</span></p><p>这是loop函数 &nbsp;<span data-w-e-type="loop-function-start" data-variable-name="age" contenteditable="false">{{? age }}</span><span style="font-size: 22px;">需要展示的</span>文案<span data-w-e-type="loop-function-end" data-variable-name="age" contenteditable="false">{{/age}}</span></p>`;

export const VARIABLE_PRESETS = [
  {
    type: VARIABLE_PRESET_ELEMENT_TYPE,
    key: "name",
    label: "姓名",
  },
  {
    type: VARIABLE_PRESET_ELEMENT_TYPE,
    key: "age",
    label: "年龄",
  },
  {
    type: VARIABLE_PRESET_ELEMENT_TYPE,
    key: "gender",
    label: "性别",
  },
  {
    type: IF_FUNCTION_PRESET_TYPE,
    key: "if  function",
    label: "IF函数",
  },
  {
    type: JOIN_FUNCTION_PRESET_TYPE,
    key: "join function",
    label: "JOIN函数",
  },
  {
    type: LOOP_FUNCTION_PRESET_TYPE,
    key: "loop function",
    label: "LOOP函数",
  },
];
