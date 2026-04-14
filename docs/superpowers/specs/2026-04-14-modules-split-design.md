# modules 目录按功能拆分设计（variable + functionTag + menus）

## 1. 背景与目标

当前 `src/modules` 下的变量元素、函数标签元素、变量样式菜单逻辑已存在，但文件组织仍偏“按文件历史演进”而非“按功能域”。本次设计目标是：在不改变编辑器核心行为的前提下，按功能重组目录与代码职责，提升可维护性与后续扩展效率。

本次采用以下已确认约束：

- 深度重构目录和模块边界。
- 保持强兼容的业务行为（功能不变）。
- 允许非功能性清理（命名、导出风格、注释优化）。
- 覆盖 `variable`、`functionTag`、变量菜单三类模块。
- 变量菜单相关代码统一放到 `src/modules/variable/menus`。
- 统一入口改为 `src/modules/index.js`，并同步修改 `main` 入口调用。
- 删除 `src/modules/variableInit.js`。

## 2. 范围与非目标

### 范围

- 重组 `src/modules` 内部结构与导入关系。
- 将变量元素、函数标签元素拆分为 render/toHtml/parseHtml/plugin 等清晰职责单元。
- 将变量菜单（含 constants/helpers/panel/menu 实现）收敛到 `src/modules/variable/menus`。
- 新增统一注册入口 `src/modules/index.js`。
- 修改应用入口（`src/main.jsx`）调用新的模块入口。

### 非目标

- 不新增新菜单能力或新元素类型。
- 不改变 `data-w-e-type`、菜单 key、HTML 序列化字段语义。
- 不调整业务交互规则（例如变量是否可编辑、函数标签渲染文本规则）。

## 3. 目标目录结构

```text
src/modules/
  index.js
  variable/
    index.js
    element/
      index.js
      render.js
      toHtml.js
      parseHtml.js
      plugin.js
    menus/
      index.js
      constants.js
      helpers.js
      panel/
        createColorPanelElement.js
      menu-impl/
        toggleMenu.js
        selectMenu.js
        colorPanelMenu.js
        resetMenu.js
  functionTag/
    index.js
    element/
      index.js
      render.js
      toHtml.js
      parseHtml.js
      plugin.js
```

删除文件：

- `src/modules/variableInit.js`

## 4. 模块职责设计

### 4.1 统一入口（`src/modules/index.js`）

提供唯一对外初始化函数（建议命名 `registerEditorModules`），内部固定顺序执行：

1. 注册 variable element
2. 注册 functionTag elements
3. 注册 variable menus

该入口仅负责装配，不承载具体业务逻辑。

### 4.2 variable 元素域

- `element/render.js`：仅负责 variable 节点 -> VNode 的渲染。
- `element/toHtml.js`：仅负责 variable 节点 -> HTML。
- `element/parseHtml.js`：仅负责 HTML -> variable 节点。
- `element/plugin.js`：仅负责 `isInline/isVoid` 扩展。
- `element/index.js`：将四类注册动作汇总到一个 `registerVariableElement`。
- `variable/index.js`：作为 variable 域聚合出口（便于后续扩展 variable 其他能力）。

### 4.3 functionTag 元素域

与 variable 元素域采用同构拆分方式：

- `render.js`：start/end 标签渲染。
- `toHtml.js`：序列化 start/end 标签。
- `parseHtml.js`：反序列化 start/end 标签。
- `plugin.js`：函数标签节点 inline/void 判定扩展。
- `index.js`：汇总为 `registerFunctionTagElements`。

### 4.4 variable 菜单域（必须在 `src/modules/variable/menus`）

- `constants.js`：菜单定义、图标、默认常量。
- `helpers.js`：变量样式读取、patch、配置读取、样式转换等公共方法。
- `panel/createColorPanelElement.js`：颜色面板 DOM 构建。
- `menu-impl/*.js`：四类菜单实现拆分：
  - toggle（加粗/斜体/下划线/删除线）
  - select（字号/字体）
  - color panel（文字色/背景色）
  - reset（清空样式）
- `menus/index.js`：统一注册全部 variable 样式菜单。

## 5. 数据流与调用流

### 5.1 启动调用流

`src/main.jsx` 在编辑器相关初始化处调用：

`registerEditorModules()`

主入口不再直接依赖 `variableModule.js` / `functionTagModule.js` / `variableStyleMenus.js`，避免调用点分散。

### 5.2 菜单交互数据流

- 菜单读取状态：`menus/helpers.js` 读取当前选中 variable 节点样式。
- 菜单执行变更：`patchSelectedVariableStyle` 仅对当前节点 setNodes patch。
- HTML 循环：variable 的 `toHtml` 与 `parseHtml` 仍通过统一 style 字段映射确保复制/粘贴回读一致。

### 5.3 兼容性数据约束

以下字段语义必须保持不变：

- variable 的 `data-w-e-type` 与 `data-variable-key`
- functionTag start/end 的 `data-w-e-type` 与 `data-condition`
- variable 菜单 key（如 `variableBold`、`variableColor`、`variableClearStyle`）

## 6. 错误处理策略

- `parseHtml` 对非法输入继续安全失败：返回 `null` 或空字符串路径，不抛异常中断编辑器。
- 菜单 `exec` 在未选中 variable 节点时保持 no-op 行为。
- `registerEditorModules` 不做吞错；开发环境保留原始报错便于定位配置或注册冲突。

## 7. 非功能性清理规则

- 命名统一：文件命名、常量命名、导出方式采用一致风格。
- 注释清理：保留必要注释，删除重复解释型注释。
- 代码组织清理：减少单文件过载逻辑，提升单文件职责单一性。

## 8. 验收标准（DoD）

### 构建与运行

- `pnpm build` 成功。
- 本地运行编辑器无模块注册报错。

### 行为回归

- 变量元素渲染、选中边框、不可编辑行为与现状一致。
- 函数标签 start/end 渲染与序列化/反序列化行为一致。
- 变量菜单（加粗/斜体/下划线/删除线/颜色/背景色/字号/字体/清空）行为一致。
- 复制粘贴后变量样式回读不丢失。

### 结构达成

- 变量菜单相关代码全部位于 `src/modules/variable/menus`。
- 初始化入口为 `src/modules/index.js`。
- `src/modules/variableInit.js` 已删除。
- `src/main.jsx` 已切换为调用新入口。

## 9. 风险与回滚

- 主要风险：导入路径迁移引发注册遗漏或循环依赖。
- 缓解方式：按“元素域 -> 菜单域 -> 统一入口 -> main 调用”顺序迁移，并在每一步做最小验证。
- 回滚策略：保持每阶段提交粒度清晰，若出现回归可回退到上一个稳定提交。
