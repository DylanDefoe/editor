import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VARIABLE_MENTION_CONFIG } from "../../config/mention";

/**
 * 根据关键字过滤 mention 选项。
 */
const filterMentionOptions = (variables = [], keyword = "") => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return variables;
  }

  return variables.filter((item) => {
    return (
      item.searchValue.includes(normalizedKeyword) ||
      item.searchLabel.includes(normalizedKeyword)
    );
  });
};

const isNavigableOptionIndex = (index, optionsCount) => {
  return optionsCount > 0 && index >= 0 && index < optionsCount;
};

const MentionOptionItem = memo(function MentionOptionItem({
  option,
  optionIndex,
  isActive,
  onSelectOption,
}) {
  return (
    <div
      data-option-index={optionIndex}
      className={`mention-item ${isActive ? "is-active" : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={() => {
        onSelectOption(option.raw);
      }}
    >
      {option.raw.label}
    </div>
  );
});

/**
 * mention 下拉：支持搜索、键盘导航和点击外部关闭。
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
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const indexedVariables = useMemo(() => {
    return variables.map((item, index) => ({
      raw: item,
      searchValue: String(item.value ?? "").toLowerCase(),
      searchLabel: String(item.label ?? "").toLowerCase(),
      key: `${item.value}-${item.label}-${index}`,
    }));
  }, [variables]);

  const options = useMemo(() => {
    return filterMentionOptions(indexedVariables, searchValue);
  }, [indexedVariables, searchValue]);

  const optionsCount = options.length;

  useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();

    // 点击弹层外部关闭弹层
    const handlePointerDownOutside = (event) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      if (!container.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handlePointerDownOutside);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
    };
  }, [onClose, open]);

  const safeActiveIndex = optionsCount
    ? Math.min(activeIndex, optionsCount - 1)
    : 0;

  useEffect(() => {
    if (!open || !optionsCount) {
      return;
    }

    const activeOptionElement = containerRef.current?.querySelector(
      `[data-option-index="${safeActiveIndex}"]`,
    );
    activeOptionElement?.scrollIntoView({ block: "nearest" });
  }, [open, optionsCount, safeActiveIndex]);

  const handleSelectOption = useCallback(
    (option) => {
      onSelect(option);
    },
    [onSelect],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!optionsCount) {
          return;
        }
        setActiveIndex((prev) => (prev + 1) % optionsCount);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!optionsCount) {
          return;
        }
        setActiveIndex((prev) => (prev - 1 + optionsCount) % optionsCount);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (!isNavigableOptionIndex(safeActiveIndex, optionsCount)) {
          return;
        }
        onSelect(options[safeActiveIndex].raw);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    },
    [onClose, onSelect, options, optionsCount, safeActiveIndex],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="mention-shell"
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
      }}
    >
      <input
        ref={inputRef}
        className="mention-input"
        value={searchValue}
        placeholder={VARIABLE_MENTION_CONFIG.searchPlaceholder}
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => {
          setSearchValue(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="mention-list">
        {options.length === 0 ? (
          <div className="mention-empty">暂无匹配变量</div>
        ) : (
          options.map((option, index) => {
            const isActive = index === safeActiveIndex;

            return (
              <MentionOptionItem
                key={option.key}
                option={option}
                optionIndex={index}
                isActive={isActive}
                onSelectOption={handleSelectOption}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default VariableMention;
