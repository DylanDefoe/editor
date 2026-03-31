import { Card, Space, Tag } from "antd";

function VariablePresetPanel({
  // 变量列表
  variables,
  // 点击变量回调
  onVariableClick,
}) {
  return (
    <Card title="变量预设" className="editor-demo-card variable-panel">
      <Space size={12} style={{ width: "100%" }}>
        {variables.map((variable) => {
          return (
            <div className="variable-item" key={variable.key}>
              <Tag
                color="blue"
                className="variable-tag"
                onClick={() => {
                  onVariableClick?.(variable.key);
                }}
              >
                {variable.label}
              </Tag>
            </div>
          );
        })}
      </Space>
    </Card>
  );
}

export default VariablePresetPanel;
