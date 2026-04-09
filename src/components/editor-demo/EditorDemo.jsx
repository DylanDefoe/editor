import { useCallback, useMemo } from "react";
import VariablePresetPanel from "./VariablePresetPanel";
import {
  VARIABLE_PRESETS,
  EDITOR_DEFAULT_VALUE,
  FUNCTION_TAG_PRESET_TYPE,
} from "../../config/editorConfig";
import EditorCard from "./EditorCard";
import useVariableMention from "../../hooks/useVariableMention";
import useVariableActions from "../../hooks/useVariableActions";
import useFunctionTagActions from "../../hooks/useFunctionTagActions";
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

  const { insertFunctionTag } = useFunctionTagActions({
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
    (preset) => {
      if (preset?.type === FUNCTION_TAG_PRESET_TYPE) {
        insertFunctionTag(preset.condition, preset.bodyText, false);
        return;
      }

      insertVariable(preset?.key, false);
    },
    [insertFunctionTag, insertVariable],
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

  const mentionVariables = useMemo(
    () =>
      VARIABLE_PRESETS.filter(
        (preset) => preset?.type !== FUNCTION_TAG_PRESET_TYPE,
      ),
    [],
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
          variables={mentionVariables}
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
