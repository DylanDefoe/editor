# Copilot Instructions for `editor`

## Build, lint, and run commands
- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build production bundle: `pnpm build`
- Preview production build: `pnpm preview`
- Lint: `pnpm lint`

Testing:
- There is currently no test runner configured in `package.json` (no `test` script yet), so single-test commands are not available at this stage.

## High-level architecture
- This is a Vite + React (JavaScript, ESM) single-page app.
- Entry point is `src/main.jsx`, which mounts `App` and globally imports:
  - wangEditor styles (`@wangeditor/editor/dist/css/style.css`)
- `src/App.jsx` is a thin shell that renders `EditorDemo`.
- The main feature lives under `src/components/editor-demo/`:
  - `EditorDemo.jsx` is the container/orchestrator (owns HTML state, derives text length, composes sections).
  - `RichTextEditor.jsx` wraps `@wangeditor/editor-for-react` `Toolbar` + `Editor`.
  - `PreviewCard.jsx` renders current content preview.
  - `StatsCard.jsx` shows text/html metrics.
  - `PageHeader.jsx` renders page title/description.
- Styling is split between global reset/layout (`src/index.css`) and feature page styles (`src/App.css`).

## Key repository conventions
- Keep UI split into small feature components under `src/components/editor-demo/`, with `EditorDemo` as the composition root.
- For component `props`, add inline comments directly in the function parameter destructuring block (current project convention).
- Treat editor content as HTML string state at the container level (`EditorDemo`) and pass through props to subcomponents.
- In wangEditor wrapper components, ensure editor lifecycle cleanup with `editor.destroy()` in `useEffect` teardown.
- Continue using pnpm for all package and script operations.
- Hooks 注释规范：`src/hooks/useVariableActions.js` 与 `src/hooks/useVariableMention.js` 需为核心状态、关键流程和编辑器行为覆写点添加简洁注释，重点解释“为什么这样做”，避免无信息量注释。

## 文档
- 组件注释：在组件函数参数的解构块中直接添加注释，说明每个 prop 的用途和类型。
- 代码注释：在复杂逻辑或重要步骤前添加简洁的注释，帮助理解代码意图和流程。

## 代码风格
- 使用现代 JavaScript 语法（ES6+），如箭头函数、解构赋值、模板字符串等。
- 组件命名使用 PascalCase，文件命名使用 CamelCase。
- 保持函数组件简洁，避免过度嵌套，必要时拆分成更小的子组件。
- 公共代码和样式应放在 `src` 目录下的合适位置，避免在组件文件中直接编写过多逻辑或样式。
