import { Button, Layout, Space } from "antd";
import { useCallback, useRef, useState } from "react";
import VariablePresetPanel from "./VariablePresetPanel";
import {
  VARIABLE_PRESETS,
  EDITOR_DEFAULT_VALUE,
} from "../../config/editorConfig";
import Editor from "./Editor";
import useVariableMention from "../../hooks/useVariableMention";
import useVariableActions from "../../hooks/useVariableActions";
import VariableMention from "./VariableMention";
import useFocusEditor from "../../hooks/useFocusEditor";

const { Content } = Layout;

function EditorDemo() {
  const [editorItems, setEditorItems] = useState(() => [
    {
      id: 1,
      html: EDITOR_DEFAULT_VALUE,
    },
  ]);
  const idRef = useRef(1);

  const { activeEditor, registerEditor, syncActiveEditor } = useFocusEditor();

  const { insertVariable } = useVariableActions({
    editor: activeEditor,
  });

  const {
    open: mentionOpen,
    position: mentionPosition,
    handleEditorBeforeInput,
    closeMention,
  } = useVariableMention({
    editor: activeEditor,
  });

  const handleVariableSelect = useCallback(
    (variableKey) => {
      insertVariable(variableKey, true);
      closeMention();
    },
    [closeMention, insertVariable],
  );

  const handleVariableClick = useCallback(
    (variableKey) => {
      insertVariable(variableKey, false);
    },
    [insertVariable],
  );

  const handleEditorChange = useCallback(
    (id, nextHtml) => {
      setEditorItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) {
            return item;
          }
          return { ...item, html: nextHtml };
        }),
      );
      syncActiveEditor();
    },
    [syncActiveEditor],
  );

  const handleCopyEditor = useCallback((id) => {
    setEditorItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) {
        return prev;
      }

      const copied = {
        id: idRef.current++,
        html: target.html,
      };

      return [...prev, copied];
    });
  }, []);

  return (
    <>
      <Layout className="editor-demo-layout">
        <Content className="editor-demo-content">
          <Button onClick={() => activeEditor?.focus()}>聚焦</Button>
          <VariablePresetPanel
            variables={VARIABLE_PRESETS}
            onVariableClick={handleVariableClick}
          />
          <VariableMention
            open={mentionOpen}
            variables={VARIABLE_PRESETS}
            position={mentionPosition}
            onSelect={handleVariableSelect}
            onClose={closeMention}
          />
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {editorItems.map((item, index) => {
              return (
                <Editor
                  key={item.id}
                  index={index}
                  value={item.html}
                  onChange={(nextHtml) => {
                    handleEditorChange(item.id, nextHtml);
                  }}
                  onCreated={(instance) => {
                    registerEditor(instance);
                  }}
                  onBeforeInput={handleEditorBeforeInput}
                  onCopy={() => {
                    handleCopyEditor(item.id);
                  }}
                />
              );
            })}
          </Space>
        </Content>
      </Layout>
    </>
  );
}

export default EditorDemo;
