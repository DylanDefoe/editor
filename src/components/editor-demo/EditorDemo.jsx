import { useCallback, useMemo, useState } from "react";
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
import IfFunctionModal from "./IfFunctionModal";
import {
  patchFunctionTagStartConditionAtPath,
  patchSelectedFunctionTagStartCondition,
} from "../../utils/functionTagNodeUtils";

const IF_MODAL_MODE = {
  create: "create",
  edit: "edit",
};

function EditorDemo() {
  const [ifModalOpen, setIfModalOpen] = useState(false);
  const [ifModalMode, setIfModalMode] = useState(IF_MODAL_MODE.create);
  const [ifModalInitialCondition, setIfModalInitialCondition] = useState("");
  const [editingStartNodePath, setEditingStartNodePath] = useState(null);

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
        setIfModalMode(IF_MODAL_MODE.create);
        setIfModalInitialCondition("");
        setEditingStartNodePath(null);
        setIfModalOpen(true);
        return;
      }

      if (!preset?.key) {
        return;
      }

      insertVariable(preset.key, false);
    },
    [insertVariable],
  );

  const handleIfModalSave = useCallback(
    ({ condition }) => {
      if (ifModalMode === IF_MODAL_MODE.edit) {
        const updated = patchSelectedFunctionTagStartCondition(
          activeEditor,
          condition,
        );

        if (!updated) {
          patchFunctionTagStartConditionAtPath(
            activeEditor,
            editingStartNodePath,
            condition,
          );
        }
      } else {
        insertFunctionTag(condition, "需要展示的文案", false);
      }

      setIfModalOpen(false);
      setIfModalMode(IF_MODAL_MODE.create);
      setIfModalInitialCondition("");
      setEditingStartNodePath(null);
    },
    [activeEditor, editingStartNodePath, ifModalMode, insertFunctionTag],
  );

  const handleIfModalCancel = useCallback(() => {
    setIfModalOpen(false);
    setIfModalMode(IF_MODAL_MODE.create);
    setIfModalInitialCondition("");
    setEditingStartNodePath(null);
  }, []);

  const handleFunctionTagStartClick = useCallback(({ condition, path }) => {
    if (!condition) {
      return;
    }

    setIfModalMode(IF_MODAL_MODE.edit);
    setIfModalInitialCondition(condition);
    setEditingStartNodePath(path);
    setIfModalOpen(true);
  }, []);

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

  const editorChangeHandlers = useMemo(() => {
    const handlers = {};

    editorCards.forEach((item) => {
      handlers[item.id] = handleEditorChange(item.id);
    });

    return handlers;
  }, [editorCards, handleEditorChange]);

  const editorCopyHandlers = useMemo(() => {
    const handlers = {};

    editorCards.forEach((item) => {
      handlers[item.id] = () => {
        copyEditor(item.id);
      };
    });

    return handlers;
  }, [copyEditor, editorCards]);

  const mentionVariables = useMemo(
    () =>
      VARIABLE_PRESETS.filter(
        (preset) => preset?.type !== FUNCTION_TAG_PRESET_TYPE,
      ).map(item => ({
        label: item.label,
        value: item.key,
        key: item.key,
      })),
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
