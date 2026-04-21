import { useState } from "react";
import { Collapse, Tag } from "antd";

const { Panel } = Collapse;

/**
 * 变量面板组件（页面右侧悬浮固定展示）
 * 支持折叠/展开，展开时以分组 Collapse 列出所有可插入变量。
 *
 * @param {Array}    props.variables            - 变量分组列表，来源于 dictTree 中 dictVariables 节点的 children
 *                                                   格式：[{ label: string, value: string, children: [{ label: string, value: string }] }]
 * @param {function} props.onVariableClick              - 点击变量 Tag 时的回调 (value: string) => void，用于向当前激活编辑器插入变量节点
 */
const VariablePresetPanel = ({ variables = [], onVariableClick }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`variable-panel${collapsed ? " collapsed" : ""}`}>
      <div
        className={`variable-panel-header${collapsed ? " collapsed" : ""}`}
        onClick={() => setCollapsed((v) => !v)}
      >
        {collapsed ? (
          <>
            <span className="variable-panel-title">变量面板</span>
          </>
        ) : (
          <>
            <span className="variable-panel-title">变量面板</span>
          </>
        )}
      </div>

      {!collapsed && (
        <div className="variable-panel-body">
          <Collapse ghost defaultActiveKey={[0]}>
            {variables.map((group, index) => (
              <Panel key={index} header={group.label}>
                <div className="variable-panel-tag-list">
                  {(group.children || []).map((item) => (
                    <Tag
                      key={item.value}
                      className="variable-panel-tag"
                      onClick={() => onVariableClick?.(item)}
                    >
                      {item.label}
                    </Tag>
                  ))}
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>
      )}
    </div>
  );
};

export default VariablePresetPanel;
