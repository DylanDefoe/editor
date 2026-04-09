# 函数标签（变量预设）设计说明

## 背景与目标

在“变量预设”面板新增一个“函数标签”入口。点击后向编辑器插入以下结构：

- 开始标签：`{{? customername == 'A' }}`（自定义元素，不可编辑）
- 中间文案：`需要展示的文案`（普通可编辑文本）
- 结束标签：`{{/}}`（自定义元素，不可编辑）

本次仅在变量预设面板提供入口，不接入 `@` mention 下拉。

## 范围

- 新增独立模块处理函数标签的注册、渲染、序列化与反序列化
- 新增独立 actions 处理函数标签插入逻辑
- 变量预设面板新增函数标签按钮并接入插入动作

不包含：

- mention 下拉中的函数标签选项
- 函数标签样式面板与样式编辑能力
- 复杂表达式编辑器

## 总体方案

采用“复合插入”方案：

1. 以两个自定义 inline + void 节点表示前后语法标签
2. 中间正文使用普通文本节点承载，可直接编辑
3. 点击函数标签时一次性插入三段结构

该方案与现有变量元素（`variable`）的扩展方式一致，改动边界清晰，回填与复制行为可控。

## 模块与文件设计

### 1) 配置层

更新 `src/config/editorConfig.js`：

- 新增函数标签元素类型常量：
  - `FUNCTION_TAG_START_ELEMENT_TYPE = "function-tag-start"`
  - `FUNCTION_TAG_END_ELEMENT_TYPE = "function-tag-end"`
- 在 `VARIABLE_PRESETS` 增加函数标签项（例如 `type: "functionTag"`），与普通变量项区分

### 2) 节点工具

新增 `src/utils/functionTagNodeUtils.js`：

- `createFunctionTagStartNode(condition)`
- `createFunctionTagEndNode()`
- `isFunctionTagStartNode(node)`
- `isFunctionTagEndNode(node)`

### 3) 元素注册模块

新增 `src/modules/functionTagModule.js`，参考 `src/modules/variableModule.js`：

- 注册渲染器（`Boot.registerRenderElem`）
  - start 节点渲染为 `<span data-w-e-type="function-tag-start">{{? ... }}</span>`
  - end 节点渲染为 `<span data-w-e-type="function-tag-end">{{/}}</span>`
- 注册 `elemToHtml`
  - start: 写入 `data-condition`
  - end: 输出固定闭合标签文本
- 注册 `parseElemHtml`
  - start 解析 `data-condition`，缺失则返回 `null`
  - end 直接生成 end 节点
- 注册插件扩展 `isInline` / `isVoid`
  - start/end 都判定为 inline + void

### 4) 初始化注册

更新 `src/modules/variableInit.js`：

- 引入并执行 `registerFunctionTagElements()`

### 5) 插入动作

新增 `src/hooks/useFunctionTagActions.js`：

- 对外 `insertFunctionTag(condition, bodyText, deleteMention = false)`
- 执行步骤：
  1. 恢复选区
  2. 可选删除触发字符（参数保留，默认 `false`）
  3. 依次插入：start 节点 -> 正文文本 -> end 节点
  4. 将光标移动到 end 之后（保证行为稳定）

### 6) 面板交互

更新 `src/components/editor-demo/EditorDemo.jsx`：

- 同时接入 `useVariableActions` 与 `useFunctionTagActions`
- 在变量预设点击事件中根据 preset 类型分流：
  - 普通变量：走 `insertVariable`
  - 函数标签：走 `insertFunctionTag("customername == 'A'", "需要展示的文案")`

更新 `src/components/editor-demo/VariablePresetPanel.jsx`：

- 继续复用列表渲染
- 对函数标签项调整展示文案和 `title`

## 数据与序列化约定

### Slate 节点

- start 节点：
  - `type: "function-tag-start"`
  - `condition: string`
  - `children: [{ text: "" }]`
- end 节点：
  - `type: "function-tag-end"`
  - `children: [{ text: "" }]`

### HTML 结构

- start：`<span data-w-e-type="function-tag-start" data-condition="customername == 'A'" contenteditable="false">{{? customername == 'A' }}</span>`
- body：普通文本（由编辑器原生序列化）
- end：`<span data-w-e-type="function-tag-end" contenteditable="false">{{/}}</span>`

## 异常与边界处理

- editor 不存在：插入函数直接返回
- `condition` 为空：拒绝插入，避免无效结构
- 反序列化 start 缺少 `data-condition`：返回 `null`，跳过脏节点
- 本期不强制校验 start/end 配对，仅保证生成结构正确

## 验收标准

1. 变量预设面板出现“函数标签”按钮
2. 点击后插入“开始标签 + 可编辑正文 + 结束标签”三段结构
3. 正文可编辑，前后标签不可编辑
4. `getHtml()` 输出包含两个函数标签 `span` 与正文
5. 将输出 HTML 回填后结构保持可用
6. 原有变量插入与变量样式能力无回归

## 测试计划

- 手动测试：
  - 光标在段首/段中/段尾插入函数标签
  - 连续插入多个函数标签
  - 编辑正文后复制粘贴并回填
- 回归测试：
  - 普通变量插入
  - 变量样式菜单对变量节点的行为

## 实施顺序

1. 新增配置常量与 preset 类型
2. 新增函数标签节点工具与注册模块
3. 在初始化入口注册模块
4. 新增插入 actions 并接入 EditorDemo
5. 调整变量预设面板展示
6. 完成手动验证与回归检查
