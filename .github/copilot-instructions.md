# Copilot Instructions for `editor`

## Build, lint, and run commands
- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build production bundle: `pnpm build`
- Preview production build: `pnpm preview`
- Lint: `pnpm lint`
- Tests: no test script is configured in `package.json` yet, so there is currently no single-test command.

## High-level architecture
- This is a Vite + React 17 SPA using wangEditor + Ant Design.
- App bootstrap is in `src/main.jsx`: global styles are imported, Ant Design locale is set to `zh_CN`, and `src/modules/variableInit` is imported once to register custom wangEditor elements/menus at startup.
- `src/App.jsx` is a shell: it wraps `EditorDemo` in `ErrorBoundary`.
- `src/components/editor-demo/EditorDemo.jsx` is the composition root and orchestration layer. It wires:
  - editor list state (`useEditorItems`) and editor duplication flow,
  - active editor tracking (`useFocusEditor`),
  - variable insertion and if-function insertion (`useVariableActions`, `useIfFunctionActions`),
  - mention trigger/position logic (`useVariableMention`),
  - IF modal create/edit lifecycle (`useIfFunctionModalController`),
  - per-card handlers (`useEditorCardHandlers`).
- Custom rich-text behavior is implemented as wangEditor extensions in `src/modules/`:
  - `variableModule.js` defines variable inline-void nodes (`{{key}}`) with parse/render/serialize support.
  - `ifFunctionModule.js` defines IF start/end inline-void nodes (`{{? condition }}` / `{{/}}`) with parse/render/serialize support.
  - `variableStyleMenus.js` + related files register variable style toolbar menus.
- `RichEditor.jsx` is the wangEditor React wrapper with dual toolbars (default + variable style toolbar) and lifecycle cleanup.

## Key repository conventions
- Use `pnpm` for all package/script operations.
- Keep `EditorDemo` as the orchestration root; push focused behavior into hooks under `src/hooks/` and keep presentational pieces in `src/components/editor-demo/`.
- Treat editor content as HTML string state in container/hooks (`useEditorItems`) and pass it down via props; editor cards are duplicated by copying the stored HTML.
- Mention insertion flow is intentional: when triggered by `@`, insertion paths delete the trigger char (`deleteBackward("character")`) before inserting variable/function nodes.
- For component props, add short inline comments directly inside the function parameter destructuring block (existing local pattern).
- In wangEditor wrappers, always destroy editor instances in `useEffect` teardown and keep custom node behavior registered through `src/modules/variableInit`.
- Hooks comment convention (important for this repo): in `src/hooks/useVariableActions.js` and `src/hooks/useVariableMention.js`, keep concise comments on core state, key flow, and editor behavior overrides, focusing on **why**.
