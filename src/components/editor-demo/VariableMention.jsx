import { useCallback, useMemo } from "react";
import { Select } from "antd";
import { VARIABLE_MENTION_CONFIG } from "../../config/mention";

/**
 * mention 下拉：基于 antd Select，按 VARIABLE_PRESETS 分组展示。
 */
function VariableMention({
  // 是否显示
  open,
  // 变量选项
  variables,
  // 弹层定位
  position,
  // 选择回调
  onSelect,
  // 关闭回调
  onClose,
}) {
  const groupedOptions = useMemo(() => {
    return (variables ?? []).map((group, index) => {
      const groupOptions = (group.children ?? []).map((item) => ({
        label: item.label,
        value: item.value,
        key: item.label + "-" + item.value + "-" + index, // 确保 key 唯一
        raw: item,
      }));

      return {
        label: group.label,
        options: groupOptions,
      };
    });
  }, [variables]);

  const optionPresetMap = useMemo(() => {
    const map = new Map();
    groupedOptions.forEach((group) => {
      group.options.forEach((option) => {
        map.set(option.value, option.raw);
      });
    });

    return map;
  }, [groupedOptions]);

  const handleSelect = useCallback(
    (value) => {
      const preset = optionPresetMap.get(value);
      if (preset) {
        onSelect?.(preset);
      }
    },
    [onSelect, optionPresetMap],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="mention-shell"
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
      }}
    >
      <Select
        popupClassName="mention-select-dropdown"
        open={true}
        showSearch
        autoFocus
        style={{ width: "100%" }}
        placeholder={VARIABLE_MENTION_CONFIG.searchPlaceholder}
        options={groupedOptions}
        optionFilterProp="label"
        notFoundContent={<div className="mention-empty">暂无匹配变量</div>}
        onSelect={handleSelect}
        onDropdownVisibleChange={(visible) => {
          if (!visible) {
            onClose?.();
          }
        }}
        onBlur={() => {
          onClose?.();
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      />
    </div>
  );
}

export default VariableMention;
