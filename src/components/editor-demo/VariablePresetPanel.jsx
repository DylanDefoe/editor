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
          return (
            <div className="variable-item" key={variable.value}>
              <button
                type="button"
                className="variable-tag"
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
