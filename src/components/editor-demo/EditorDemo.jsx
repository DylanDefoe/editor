import { useCallback, useMemo } from "react";
import VariablePresetPanel from "./VariablePresetPanel";
import {
  VARIABLE_PRESETS,
  EDITOR_DEFAULT_VALUE,
} from "../../config/editorConfig";
import EditorCard from "./EditorCard";
import useVariableMention from "../../hooks/useVariableMention";
import useVariableActions from "../../hooks/useVariableActions";
import useIfFunctionActions from "../../hooks/useIfFunctionActions";
import useJoinFunctionActions from "../../hooks/useJoinFunctionActions";
import VariableMention from "./VariableMention";
import useFocusEditor from "../../hooks/useFocusEditor";
import useEditorItems from "../../hooks/useEditorItems";
import IfFunctionModal from "./IfFunctionModal";
import useIfFunctionModalController from "../../hooks/useIfFunctionModalController";
import JoinFunctionModal from "./JoinFunctionModal";
import useJoinFunctionModalController from "../../hooks/useJoinFunctionModalController";
import useEditorCardHandlers from "../../hooks/useEditorCardHandlers";
import {
  getMentionVariables,
  isJoinFunctionPreset,
  isIfFunctionPreset,
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

  const { insertIfFunction } = useIfFunctionActions({
    editor: activeEditor,
  });

  const { insertJoinFunction } = useJoinFunctionActions({
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
    insertIfFunction,
  });

  const {
    open: joinModalOpen,
    initialValues: joinModalInitialValues,
    openForCreate: openJoinModalForCreate,
    openForEdit: openJoinModalForEdit,
    closeAndReset: handleJoinModalCancel,
    saveValues: handleJoinModalSave,
  } = useJoinFunctionModalController({
    activeEditor,
    insertJoinFunction,
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
    (preset) => {
      if (isIfFunctionPreset(preset)) {
        openForCreate({ deleteMention: true });
        closeMention();
        return;
      }
      if (isJoinFunctionPreset(preset)) {
        openJoinModalForCreate({ deleteMention: true });
        closeMention();
        return;
      }

      const variableKey = preset?.key;
      if (!variableKey) {
        return;
      }

      insertVariable(variableKey, true);
      closeMention();
    },
    [closeMention, insertVariable, openForCreate, openJoinModalForCreate],
  );

  const handleVariableClick = useCallback(
    (preset) => {
      if (isIfFunctionPreset(preset)) {
        openForCreate();
        return;
      }
      if (isJoinFunctionPreset(preset)) {
        openJoinModalForCreate();
        return;
      }

      if (!preset?.key) {
        return;
      }

      insertVariable(preset.key, false);
    },
    [insertVariable, openForCreate, openJoinModalForCreate],
  );

  const handleIfFunctionStartClick = useCallback(({ condition, path }) => {
    openForEdit(condition, path);
  }, [openForEdit]);

  const handleJoinFunctionClick = useCallback(({ variableName, separator, path }) => {
    openJoinModalForEdit(
      {
        variableName,
        separator,
      },
      path,
    );
  }, [openJoinModalForEdit]);

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
    () => VARIABLE_PRESETS,
    [],
  );

  const modalVariables = useMemo(
    () => getMentionVariables(VARIABLE_PRESETS),
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
          variables={modalVariables}
          initialCondition={ifModalInitialCondition}
          onCancel={handleIfModalCancel}
          onSave={handleIfModalSave}
        />
        <JoinFunctionModal
          open={joinModalOpen}
          variables={modalVariables}
          initialValues={joinModalInitialValues}
          onCancel={handleJoinModalCancel}
          onSave={handleJoinModalSave}
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
                  onIfFunctionStartClick={handleIfFunctionStartClick}
                  onJoinFunctionClick={handleJoinFunctionClick}
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
