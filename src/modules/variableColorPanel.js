import { EMPTY_VALUE } from "./variableStyleConstants";

/**
 * 创建颜色面板 DOM（含默认色按钮），用于 IDropPanelMenu。
 */
export const createColorPanelElement = ({ colors, activeColor, onSelect }) => {
  const panel = document.createElement("div");
  panel.style.display = "grid";
  panel.style.gridTemplateColumns = "repeat(8, 20px)";
  panel.style.gap = "8px";
  panel.style.padding = "4px";

  const createColorButton = ({ color, title, selected, clear = false }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.title = title;
    button.style.width = "16px";
    button.style.height = "16px";
    button.style.border = selected ? "2px solid #1677ff" : "1px solid #d9d9d9";
    button.style.padding = "0";
    button.style.cursor = "pointer";
    button.style.background = clear
      ? "linear-gradient(45deg,#f5f5f5 25%,#fff 25%,#fff 50%,#f5f5f5 50%,#f5f5f5 75%,#fff 75%,#fff)"
      : color;
    if (clear) {
      button.style.backgroundSize = "8px 8px";
    }
    return button;
  };

  const clearBtn = createColorButton({
    title: "默认",
    selected: !activeColor,
    clear: true,
  });
  clearBtn.addEventListener("click", () => onSelect(EMPTY_VALUE));
  panel.appendChild(clearBtn);

  colors.forEach((color) => {
    const btn = createColorButton({
      color,
      title: color,
      selected: activeColor === color,
    });
    btn.addEventListener("click", () => onSelect(color));
    panel.appendChild(btn);
  });

  return panel;
};

