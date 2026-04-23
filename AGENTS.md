# AGENTS.md

> 本文件为 AI 助手提供代码库导航指南。详细文档见 `.agents/summary/`。

## 项目概述

基于 React 17 + wangEditor 5 的富文本模板编辑器。在标准富文本基础上扩展了 4 种自定义 inline void 元素（variable、if-function、loop-function、join-function），用于在可视化编辑器中插入模板变量和逻辑函数。

## 目录结构

```
src/
├── main.jsx                    # 应用入口，副作用导入 modules 完成注册
├── App.jsx                     # 根组件，ErrorBoundary 包裹
├── modules/                    # wangEditor 自定义模块（核心扩展层）
│   ├── index.js                # 统一注册入口
│   ├── variable/               # 变量元素 + 样式菜单系统
│   │   └── menu/               # 4 个自定义菜单类（样式控制）
│   ├── ifFunction/             # IF 条件函数（成对标签）
│   ├── loopFunction/           # LOOP 循环函数（成对标签）
│   └── joinFunction/           # JOIN 连接函数（单标签）
├── hooks/                      # React Hooks（状态管理层）
│   ├── useActiveEditor.js      # 多编辑器焦点管理
│   ├── useEditorItems.js       # 编辑器列表 CRUD
│   ├── useVariableMention.js   # @ 触发的 mention 弹层
│   ├── useRichEditorDomEvents.js # 编辑器 DOM 事件统一绑定
│   ├── use*Actions.js          # 各元素的插入动作
│   └── use*ModalController.js  # 函数弹窗的 create/edit 状态机
├── components/editor-demo/     # UI 组件
│   ├── EditorDemo.jsx          # 主容器，组合所有 hooks 和子组件
│   ├── RichEditor.jsx          # wangEditor 封装（主工具栏 + 变量样式工具栏）
│   ├── EditorCard.jsx          # 编辑器卡片（编辑器 + 预览）
│   └── *Modal.jsx / *Mention.jsx / *Panel.jsx
├── config/                     # 配置
│   ├── data.js                 # 变量分组数据源
│   ├── variable.js             # 元素类型常量 + 预设转换
│   ├── editor.js               # 编辑器默认 HTML
│   └── mention.js              # mention 触发配置（@ 字符）
└── utils/
    └── variablePresetUtils.js  # 预设类型判断工具
```

## 关键架构决策

- **模块注册时机**: `src/main.jsx` 通过 `import "./modules"` 副作用在应用渲染前完成所有 wangEditor 模块注册。修改模块注册逻辑时需注意此执行顺序。
- **每个模块统一结构**: `plugin.js`（编辑器行为覆写）、`render-elem.js`（渲染）、`elem-to-html.js`（序列化）、`parse-elem-html.js`（反序列化）、`node-utils.js`（节点操作）。新增自定义元素应遵循此模式。
- **成对标签 vs 单标签**: if-function 和 loop-function 使用 start/end 成对标签包裹内容；join-function 和 variable 是单个 inline void 节点。
- **Controller 模式**: 函数弹窗通过 `useXxxModalController` 统一管理 create/edit 双模式，保存时根据模式分流到 insert 或 patch 操作。
- **多编辑器管理**: 支持多个编辑器实例并存，通过 `useActiveEditor` 的 `isFocused()` 判断焦点归属，所有插入操作作用于 activeEditor。

## 非常规模式

- React 17 使用 `render()` 而非 `createRoot()`
- `@types/react` 声明在 dependencies 而非 devDependencies
- Ant Design 4 全量 CSS 引入（`antd/dist/antd.css`）
- variable 模块额外包含 `menu/` 子目录和 `shared-style.js`，是唯一带自定义菜单的模块

## 配置文件

- `vite.config.js`: 仅配置 `@vitejs/plugin-react`
- `eslint.config.js`: flat config 格式，启用 react-hooks 和 react-refresh 插件
- `.github/copilot-instructions.md`: GitHub Copilot 指令文件

## 详细文档

完整文档位于 `.agents/summary/`，以 `index.md` 为入口索引。

## Custom Instructions
<!-- This section is for human and agent-maintained operational knowledge.
     Add repo-specific conventions, gotchas, and workflow rules here.
     This section is preserved exactly as-is when re-running codebase-summary. -->

> 以下规范来自 Karpathy-Inspired Guidelines，用于减少 AI 编程助手的常见错误。

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**

- Transform vague tasks into verifiable goals before starting.
- For multi-step tasks, state a brief plan with verification steps.
- Clarifying questions come before implementation, not after mistakes.
