export const VARIABLE_TOKEN_CONFIG = {
  prefix: "{{",
  suffix: "}}",
};

// 变量节点类型定义
export const VARIABLE_ELEMENT_TYPE = "variable";
export const IF_FUNCTION_START_ELEMENT_TYPE = "if-function-start";
export const IF_FUNCTION_END_ELEMENT_TYPE = "if-function-end";
export const IF_FUNCTION_PRESET_TYPE = "if-function";

export const VARIABLE_MENTION_CONFIG = {
  triggerChar: "@",
  searchPlaceholder: "搜索变量",
  dropdownWidth: 280,
};

export const EDITOR_DEFAULT_VALUE = `<h2>欢迎使用编辑器</h2><p>这是一个基于 React + wangEditor<span data-w-e-type="variable" data-variable-key="age" contenteditable="false" style="font-weight: 700; font-style: italic; color: rgb(29, 57, 196); font-size: 19px; font-family: 标楷体">{{age}}</span>的基础富文本 Demo。</p>
<p>这是函数 &nbsp;<span data-w-e-type="if-function-start" data-condition="age > 22" contenteditable="false">{{? age > 22 }}</span>需<span style="color: rgb(130, 0, 20);">要展示</span>的文案<span data-w-e-type="if-function-end" contenteditable="false">{{/}}</span></p>
`;

export const VARIABLE_PRESETS = [
  {
    key: "name",
    label: "姓名",
  },
  {
    key: "age",
    label: "年龄",
  },
  {
    key: "gender",
    label: "性别",
  },
  {
    type: IF_FUNCTION_PRESET_TYPE,
    key: "if  function",
    label: "IF函数",
    bodyText: "需要展示的文案",
  },
];
