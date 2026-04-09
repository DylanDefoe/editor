export const VARIABLE_TOKEN_CONFIG = {
  prefix: "{{",
  suffix: "}}",
};

// 变量节点类型定义
export const VARIABLE_ELEMENT_TYPE = "variable";
export const FUNCTION_TAG_START_ELEMENT_TYPE = "function-tag-start";
export const FUNCTION_TAG_END_ELEMENT_TYPE = "function-tag-end";
export const FUNCTION_TAG_PRESET_TYPE = "functionTag";

export const VARIABLE_MENTION_CONFIG = {
  triggerChar: "@",
  searchPlaceholder: "搜索变量",
  dropdownWidth: 280,
};

export const EDITOR_DEFAULT_VALUE = `<h2>欢迎使用编辑器</h2><p>这是一个基于 React + wangEditor<span data-w-e-type="variable" data-variable-key="age" contenteditable="false" style="font-weight: 700; font-style: italic; color: rgb(29, 57, 196); font-size: 19px; font-family: 标楷体">{{age}}</span>的基础富文本 Demo。</p>
<p>大声点啊<span data-w-e-type="function-tag-start" data-condition="age &gt;= 22" contenteditable="false">{{? age &gt;= 22 }}</span>需<strong>要展示</strong>的文案<span data-w-e-type="function-tag-end" contenteditable="false">{{/}}</span></p>

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
    type: FUNCTION_TAG_PRESET_TYPE,
    key: "ifCustomerNameA",
    label: "IF函数",
    bodyText: "需要展示的文案",
  },
];
