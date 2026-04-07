import { useEffect, useMemo, useState } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";

function RichEditor({
  // 编辑器 HTML 内容
  value,
  // 内容变化回调
  onChange,
  // 编辑器实例挂载回调，返回值可选为销毁清理函数
  onMount,
  // beforeinput 事件回调
  onBeforeInput,
}) {
  const [editor, setEditor] = useState(null);

  // 通过 memo 保持配置引用稳定，避免不必要重渲染。
  const editorConfig = useMemo(
    () => ({
      placeholder: "请输入内容...",
      MENU_CONF: {},
    }),
    [],
  );

  const variableToolbarConfig = useMemo(
    () => ({
      toolbarKeys: [
        "variableColor",
        "variableBackgroundColor",
        "|",
        "variableFontSize",
        "variableFontFamily",
        "|",
        "variableBold",
        "variableItalic",
        "variableUnderline",
        "variableStrikeThrough",
        "|",
        "variableClearStyle",
      ],
    }),
    [],
  );

  useEffect(() => {
    if (!editor) {
      return undefined;
    }

    const dispose = onMount?.(editor);
    return () => {
      if (typeof dispose === "function") {
        dispose();
      }
    };
  }, [editor, onMount]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return undefined;
    }

    const editableContainer = editor.getEditableContainer();
    if (!editableContainer) {
      return undefined;
    }

    const handleBeforeInput = (event) => {
      onBeforeInput?.(event);
    };
    editableContainer.addEventListener("beforeinput", handleBeforeInput);

    return () => {
      editableContainer.removeEventListener("beforeinput", handleBeforeInput);
    };
  }, [editor, onBeforeInput]);

  return (
    <div className="editor-shell">
      <Toolbar
        editor={editor}
        mode="default"
        className="editor-toolbar"
      />
      <div className="variable-toolbar-label">变量样式</div>
      <Toolbar
        editor={editor}
        defaultConfig={variableToolbarConfig}
        mode="default"
        className="variable-toolbar"
      />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={(instance) => {
          onChange(instance.getHtml());
        }}
        mode="default"
        className="editor-content"
      />
    </div>
  );
}

export default RichEditor;
