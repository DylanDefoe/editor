import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "antd";
import { VARIABLE_MENTION_CONFIG } from "../../config/editorConfig";

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


  const options = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) {
      return variables;
    }

    return variables.filter((item) => {
      return (
        item.key.toLowerCase().includes(keyword) ||
        item.label.toLowerCase().includes(keyword)
      );
    });
  }, [searchValue, variables]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!options.length) {
        return;
      }
      setActiveIndex((prev) => (prev + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!options.length) {
        return;
      }
      setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (!options.length) {
        return;
      }
      onSelect(options[activeIndex].key);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onClose?.();
    }
  };

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
      <Input
        ref={inputRef}
        value={searchValue}
        placeholder={VARIABLE_MENTION_CONFIG.searchPlaceholder}
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
            const isActive = index === activeIndex;

            return (
              <div
                key={option.key}
                className={`mention-item ${isActive ? "is-active" : ""}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  onSelect(option.key);
                }}
              >
                <span>{option.label}</span>
                <span className="mention-item-key">{`{{${option.key}}}`}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default VariableMention;
