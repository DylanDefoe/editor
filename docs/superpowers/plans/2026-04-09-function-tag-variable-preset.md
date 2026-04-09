# 函数标签（变量预设）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在“变量预设”面板新增“函数标签”入口，点击后插入“开始标签 + 可编辑正文 + 结束标签”的结构，并支持 HTML 序列化/反序列化。

**Architecture:** 复用现有 `variable` 自定义元素扩展模式，新增独立 `functionTag` 模块注册两个 inline + void 元素（start/end），正文保持普通文本节点。通过独立 hook 统一插入三段结构，并在 preset 点击事件中按类型分流。所有改动保持与现有变量能力隔离，避免影响 mention 与变量样式菜单。

**Tech Stack:** React 19, wangEditor 5, Vite 8, ESLint 9

---

## File Structure

- Create: `src/modules/functionTagModule.js` - 注册函数标签 start/end 的渲染、序列化、反序列化和 editor 插件行为
- Create: `src/utils/functionTagNodeUtils.js` - 创建/识别函数标签节点
- Create: `src/hooks/useFunctionTagActions.js` - 插入函数标签三段结构
- Modify: `src/config/editorConfig.js` - 新增函数标签元素类型常量，扩展 `VARIABLE_PRESETS`
- Modify: `src/modules/variableInit.js` - 注册函数标签模块
- Modify: `src/components/editor-demo/EditorDemo.jsx` - 接入函数标签动作并按 preset 类型分流
- Modify: `src/components/editor-demo/VariablePresetPanel.jsx` - 支持函数标签 preset 的展示文案与 title

### Task 1: 配置与节点基础

**Files:**
- Create: `src/utils/functionTagNodeUtils.js`
- Modify: `src/config/editorConfig.js`

- [ ] **Step 1: 在配置中定义函数标签元素类型与 preset**

```js
// src/config/editorConfig.js
export const FUNCTION_TAG_START_ELEMENT_TYPE = "function-tag-start";
export const FUNCTION_TAG_END_ELEMENT_TYPE = "function-tag-end";

export const VARIABLE_PRESETS = [
  { key: "name", label: "姓名" },
  { key: "age", label: "年龄" },
  { key: "gender", label: "性别" },
  {
    type: "functionTag",
    key: "ifCustomerNameA",
    label: "函数标签",
    condition: "customername == 'A'",
    bodyText: "需要展示的文案",
  },
];
```

- [ ] **Step 2: 新增函数标签节点工具**

```js
// src/utils/functionTagNodeUtils.js
import {
  FUNCTION_TAG_START_ELEMENT_TYPE,
  FUNCTION_TAG_END_ELEMENT_TYPE,
} from "../config/editorConfig";

export const createFunctionTagStartNode = (condition) => {
  if (!condition) {
    throw new Error("Function tag condition is required");
  }

  return {
    type: FUNCTION_TAG_START_ELEMENT_TYPE,
    condition,
    children: [{ text: "" }],
  };
};

export const createFunctionTagEndNode = () => {
  return {
    type: FUNCTION_TAG_END_ELEMENT_TYPE,
    children: [{ text: "" }],
  };
};

export const isFunctionTagStartNode = (node) => {
  return node && node.type === FUNCTION_TAG_START_ELEMENT_TYPE;
};

export const isFunctionTagEndNode = (node) => {
  return node && node.type === FUNCTION_TAG_END_ELEMENT_TYPE;
};
```

- [ ] **Step 3: 运行 lint 检查语法与导出**

Run: `pnpm lint`
Expected: PASS（无新增 eslint 错误）

- [ ] **Step 4: Commit**

```bash
git add src/config/editorConfig.js src/utils/functionTagNodeUtils.js
git commit -m "feat: define function tag preset and node utilities"
```

### Task 2: 注册函数标签自定义元素

**Files:**
- Create: `src/modules/functionTagModule.js`
- Modify: `src/modules/variableInit.js`

- [ ] **Step 1: 新增函数标签模块（start/end 双元素）**

```js
// src/modules/functionTagModule.js
import { Boot, DomEditor } from "@wangeditor/editor";
import {
  FUNCTION_TAG_START_ELEMENT_TYPE,
  FUNCTION_TAG_END_ELEMENT_TYPE,
} from "../config/editorConfig";
import {
  isFunctionTagStartNode,
  isFunctionTagEndNode,
} from "../utils/functionTagNodeUtils";

const createStartText = (condition) => `{{? ${condition} }}`;
const createEndText = () => "{{/}}";

const createFunctionTagVNode = (elemNode, editor) => {
  const selected = DomEditor.isNodeSelected(editor, elemNode);

  if (elemNode.type === FUNCTION_TAG_START_ELEMENT_TYPE) {
    const condition = elemNode.condition || "";
    return {
      sel: "span",
      data: {
        attrs: {
          "data-w-e-type": FUNCTION_TAG_START_ELEMENT_TYPE,
          "data-condition": condition,
          contenteditable: "false",
        },
        style: {
          userSelect: "none",
          padding: "1px 4px",
          borderRadius: "4px",
          backgroundColor: "#EEF4FF",
          border: selected ? "2px solid #B4D5FF" : "2px solid transparent",
          color: "#1D39C4",
        },
      },
      children: [{ text: createStartText(condition) }],
    };
  }

  return {
    sel: "span",
    data: {
      attrs: {
        "data-w-e-type": FUNCTION_TAG_END_ELEMENT_TYPE,
        contenteditable: "false",
      },
      style: {
        userSelect: "none",
        padding: "1px 4px",
        borderRadius: "4px",
        backgroundColor: "#EEF4FF",
        border: selected ? "2px solid #B4D5FF" : "2px solid transparent",
        color: "#1D39C4",
      },
    },
    children: [{ text: createEndText() }],
  };
};

export function registerFunctionTagElements() {
  Boot.registerRenderElem({
    type: FUNCTION_TAG_START_ELEMENT_TYPE,
    renderElem: (elemNode, children, editor) => createFunctionTagVNode(elemNode, editor),
  });

  Boot.registerRenderElem({
    type: FUNCTION_TAG_END_ELEMENT_TYPE,
    renderElem: (elemNode, children, editor) => createFunctionTagVNode(elemNode, editor),
  });

  Boot.registerElemToHtml({
    type: FUNCTION_TAG_START_ELEMENT_TYPE,
    elemToHtml: (elemNode) => {
      const condition = elemNode.condition || "";
      return `<span data-w-e-type="${FUNCTION_TAG_START_ELEMENT_TYPE}" data-condition="${condition}" contenteditable="false">${createStartText(condition)}</span>`;
    },
  });

  Boot.registerElemToHtml({
    type: FUNCTION_TAG_END_ELEMENT_TYPE,
    elemToHtml: () => {
      return `<span data-w-e-type="${FUNCTION_TAG_END_ELEMENT_TYPE}" contenteditable="false">${createEndText()}</span>`;
    },
  });

  Boot.registerParseElemHtml({
    selector: `span[data-w-e-type="${FUNCTION_TAG_START_ELEMENT_TYPE}"]`,
    parseElemHtml: (domElem) => {
      const condition = domElem.getAttribute("data-condition");
      if (!condition) {
        return null;
      }

      return {
        type: FUNCTION_TAG_START_ELEMENT_TYPE,
        condition,
        children: [{ text: "" }],
      };
    },
  });

  Boot.registerParseElemHtml({
    selector: `span[data-w-e-type="${FUNCTION_TAG_END_ELEMENT_TYPE}"]`,
    parseElemHtml: () => {
      return {
        type: FUNCTION_TAG_END_ELEMENT_TYPE,
        children: [{ text: "" }],
      };
    },
  });

  Boot.registerPlugin((editor) => {
    const { isInline, isVoid } = editor;

    editor.isInline = (element) => {
      return (
        isFunctionTagStartNode(element) ||
        isFunctionTagEndNode(element) ||
        isInline(element)
      );
    };

    editor.isVoid = (element) => {
      return (
        isFunctionTagStartNode(element) ||
        isFunctionTagEndNode(element) ||
        isVoid(element)
      );
    };

    return editor;
  });
}
```

- [ ] **Step 2: 在初始化入口注册函数标签模块**

```js
// src/modules/variableInit.js
import { registerVariableElement } from "./variableModule";
import { registerVariableStyleMenus } from "./variableStyleMenus";
import { registerFunctionTagElements } from "./functionTagModule";

registerVariableElement();
registerFunctionTagElements();
registerVariableStyleMenus();
```

- [ ] **Step 3: 运行构建验证元素注册无运行时报错**

Run: `pnpm build`
Expected: PASS（vite 打包成功）

- [ ] **Step 4: Commit**

```bash
git add src/modules/functionTagModule.js src/modules/variableInit.js
git commit -m "feat: register custom function tag elements"
```

### Task 3: 插入动作与 UI 面板接入

**Files:**
- Create: `src/hooks/useFunctionTagActions.js`
- Modify: `src/components/editor-demo/EditorDemo.jsx`
- Modify: `src/components/editor-demo/VariablePresetPanel.jsx`

- [ ] **Step 1: 新增函数标签插入 hook**

```js
// src/hooks/useFunctionTagActions.js
import { useCallback, useEffect, useRef } from "react";
import {
  createFunctionTagStartNode,
  createFunctionTagEndNode,
} from "../utils/functionTagNodeUtils";

function useFunctionTagActions({ editor } = {}) {
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const insertFunctionTag = useCallback((condition, bodyText, deleteMention = false) => {
    const currentEditor = editorRef.current;

    if (!currentEditor || !condition) {
      return;
    }

    currentEditor.restoreSelection();

    if (deleteMention) {
      currentEditor.deleteBackward("character");
    }

    currentEditor.insertNode(createFunctionTagStartNode(condition));
    currentEditor.insertText(bodyText || "");
    currentEditor.insertNode(createFunctionTagEndNode());
    currentEditor.move(1);
  }, []);

  return {
    insertFunctionTag,
  };
}

export default useFunctionTagActions;
```

- [ ] **Step 2: 在编辑器页接入 preset 分流逻辑**

```js
// src/components/editor-demo/EditorDemo.jsx (核心逻辑片段)
import useFunctionTagActions from "../../hooks/useFunctionTagActions";

const { insertVariable } = useVariableActions({ editor: activeEditor });
const { insertFunctionTag } = useFunctionTagActions({ editor: activeEditor });

const handleVariableClick = useCallback(
  (preset) => {
    if (preset?.type === "functionTag") {
      insertFunctionTag(preset.condition, preset.bodyText, false);
      return;
    }

    insertVariable(preset?.key, false);
  },
  [insertFunctionTag, insertVariable],
);

<VariablePresetPanel
  variables={VARIABLE_PRESETS}
  onVariableClick={handleVariableClick}
/>
```

- [ ] **Step 3: 调整变量面板组件以传递 preset 对象**

```js
// src/components/editor-demo/VariablePresetPanel.jsx (核心逻辑片段)
{variables.map((variable) => {
  const isFunctionTag = variable.type === "functionTag";
  const title = isFunctionTag
    ? "插入函数标签"
    : `插入 {{${variable.key}}}`;

  return (
    <div className="variable-item" key={variable.key}>
      <button
        type="button"
        className="variable-tag"
        title={title}
        onClick={() => {
          onVariableClick?.(variable);
        }}
      >
        {variable.label}
      </button>
    </div>
  );
})}
```

- [ ] **Step 4: 手动失败验证（实现前行为）**

Run: `pnpm dev`
Expected (实现前): 点击“函数标签”无法插入 start/body/end 三段结构

- [ ] **Step 5: 手动通过验证（实现后行为）**

Run: `pnpm dev`
Expected (实现后):
- 点击“函数标签”插入 `{{? customername == 'A' }}` + `需要展示的文案` + `{{/}}`
- 中间文案可编辑，前后标签不可编辑
- 刷新后（回填 HTML）结构仍可用

- [ ] **Step 6: 最终静态检查**

Run: `pnpm lint && pnpm build`
Expected: PASS（lint 与构建均成功）

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useFunctionTagActions.js src/components/editor-demo/EditorDemo.jsx src/components/editor-demo/VariablePresetPanel.jsx
git commit -m "feat: add function-tag preset insertion with editable body text"
```

### Task 4: 回归检查与收尾

**Files:**
- Modify: none (仅验证)

- [ ] **Step 1: 变量能力回归验证**

Run: `pnpm dev`
Expected:
- 普通变量（姓名/年龄/性别）仍可插入
- 变量样式菜单仍可对变量节点生效

- [ ] **Step 2: 输出 HTML 结构核对**

Run: 在页面中复制编辑器 HTML（通过现有复制按钮）
Expected:
- 包含 `data-w-e-type="function-tag-start"` 与 `data-w-e-type="function-tag-end"`
- start 含 `data-condition="customername == 'A'"`

- [ ] **Step 3: 最终提交（如有额外修复）**

```bash
git add -A
git commit -m "chore: polish function-tag preset behavior and regression fixes"
```
