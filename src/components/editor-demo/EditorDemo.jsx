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
    <div className="editor-demo-layout">
      <div className="bg-glow bg-glow-left" />
      <div className="bg-glow bg-glow-right" />
      <main className="editor-demo-content">
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
        <div className="editor-cards-stack">
          {editorCards.map((item) => {
            return (
              <div
                key={item.id}
                className="reveal-item"
                style={{ animationDelay: `${Math.min(item.index * 80, 320)}ms` }}
              >
                <EditorCard
                  index={item.index}
                  value={item.html}
                  onChange={handleEditorChange(item.id)}
                  onEditorMount={registerEditor}
                  onBeforeInput={handleEditorBeforeInput}
                  onCopy={() => {
                    copyEditor(item.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default EditorDemo;
