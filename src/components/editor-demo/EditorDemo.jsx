import { useCallback, useMemo } from "react";
import VariablePresetPanel from "./VariablePresetPanel";
import {
  VARIABLE_PRESETS,
  EDITOR_DEFAULT_VALUE,
} from "../../config/editorConfig";
import EditorCard from "./EditorCard";
import useVariableMention from "../../hooks/useVariableMention";
import useVariableActions from "../../hooks/useVariableActions";
import useFunctionTagActions from "../../hooks/useFunctionTagActions";
import VariableMention from "./VariableMention";
import useFocusEditor from "../../hooks/useFocusEditor";
import useEditorItems from "../../hooks/useEditorItems";
import IfFunctionModal from "./IfFunctionModal";
import useIfFunctionModalController from "../../hooks/useIfFunctionModalController";
import useEditorCardHandlers from "../../hooks/useEditorCardHandlers";
import {
  getMentionVariables,
  isFunctionTagPreset,
} from "../../utils/variablePresetUtils";

/**
 * 编辑器演示页：负责拼装变量面板、mention、IF 弹窗和多编辑器卡片。
 */
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
    open: ifModalOpen,
    initialCondition: ifModalInitialCondition,
    openForCreate,
    openForEdit,
    closeAndReset: handleIfModalCancel,
    saveCondition: handleIfModalSave,
  } = useIfFunctionModalController({
    activeEditor,
    insertFunctionTag,
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
      if (isFunctionTagPreset(preset)) {
        openForCreate();
        return;
      }

      if (!preset?.key) {
        return;
      }

      insertVariable(preset.key, false);
    },
    [insertVariable, openForCreate],
  );

  const handleFunctionTagStartClick = useCallback(({ condition, path }) => {
    openForEdit(condition, path);
  }, [openForEdit]);

  const {
    editorCards,
    editorChangeHandlers,
    editorCopyHandlers,
  } = useEditorCardHandlers({
    editorItems,
    updateEditorHtml,
    syncActiveEditor,
    copyEditor,
  });

  const mentionVariables = useMemo(
    () =>
      getMentionVariables(VARIABLE_PRESETS),
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
        <IfFunctionModal
          open={ifModalOpen}
          variables={mentionVariables}
          initialCondition={ifModalInitialCondition}
          onCancel={handleIfModalCancel}
          onSave={handleIfModalSave}
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
                  onChange={editorChangeHandlers[item.id]}
                  onEditorMount={registerEditor}
                  onBeforeInput={handleEditorBeforeInput}
                  onFunctionTagStartClick={handleFunctionTagStartClick}
                  onCopy={editorCopyHandlers[item.id]}
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
