import { Layout, Space } from "antd";
import { useCallback, useMemo } from "react";
import VariablePresetPanel from "./VariablePresetPanel";
import {
  VARIABLE_PRESETS,
  EDITOR_DEFAULT_VALUE,
} from "../../config/editorConfig";
import EditorCard from "./EditorCard";
import useVariableMention from "../../hooks/useVariableMention";
import useVariableActions from "../../hooks/useVariableActions";
import VariableMention from "./VariableMention";
import useFocusEditor from "../../hooks/useFocusEditor";
import useEditorItems from "../../hooks/useEditorItems";

const { Content } = Layout;

function EditorDemo() {
  const { editorItems, updateEditorHtml, copyEditor } = useEditorItems({
    initialHtml: EDITOR_DEFAULT_VALUE,
  });

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
    (id) =>
      (nextHtml) => {
        updateEditorHtml(id, nextHtml);
        syncActiveEditor();
      },
    [updateEditorHtml, syncActiveEditor],
  );

  const editorCards = useMemo(
    () =>
      editorItems.map((item, index) => ({
        id: item.id,
        index,
        html: item.html,
      })),
    [editorItems],
  );

  return (
    <>
      <Layout className="editor-demo-layout">
        <Content className="editor-demo-content">
          <VariablePresetPanel
            variables={VARIABLE_PRESETS}
            onVariableClick={handleVariableClick}
          />
          <VariableMention
            key={activeEditor?.id ?? "mention"}
            open={mentionOpen}
            variables={VARIABLE_PRESETS}
            position={mentionPosition}
            onSelect={handleVariableSelect}
            onClose={closeMention}
          />
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {editorCards.map((item) => {
              return (
                <EditorCard
                  key={item.id}
                  index={item.index}
                  value={item.html}
                  onChange={handleEditorChange(item.id)}
                  onEditorMount={registerEditor}
                  onBeforeInput={handleEditorBeforeInput}
                  onCopy={() => {
                    copyEditor(item.id);
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
