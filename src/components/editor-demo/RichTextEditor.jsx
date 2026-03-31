import { useEffect, useState } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";

function RichTextEditor({
  // 编辑器 HTML 内容
  value,
  // 内容变化回调
  onChange,
  // 编辑器创建后回调
  onCreated,
  // beforeinput 事件回调
  onBeforeInput,
}) {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const editableContainer = editor.getEditableContainer();
    if (!editableContainer) {
      return;
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
        defaultConfig={{}}
        mode="default"
        style={{ borderBottom: "1px solid #f0f0f0" }}
      />
      <Editor
        defaultConfig={{ placeholder: "请输入内容..." }}
        value={value}
        onCreated={(instance) => {
          setEditor(instance);
          onCreated?.(instance);
        }}
        onChange={(instance) => {
          onChange(instance.getHtml());
        }}
        mode="default"
        style={{ height: 320, overflowY: "hidden" }}
      />
    </div>
  );
}

export default RichTextEditor;
