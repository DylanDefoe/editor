import { isFunctionPreset } from "../../utils/variablePresetUtils";

function VariablePresetPanel({
  // 变量列表
  variables,
  // 点击变量回调
  onVariableClick,
}) {
  return (
    <section className="editor-demo-card panel-card variable-panel">
      <header className="panel-card-header">
        <h2 className="panel-card-title">变量预设</h2>
      </header>
      <div className="variable-list">
        {variables.map((variable) => {
          const functionPreset = isFunctionPreset(variable);

          return (
            <div className="variable-item" key={variable.key}>
              <button
                type="button"
                className="variable-tag"
                title={
                  functionPreset
                    ? `配置 ${variable.label}`
                    : `插入 {{${variable.key}}}`
                }
                onClick={() => {
                  onVariableClick?.(variable);
                }}
              >
                {variable.label}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default VariablePresetPanel;
