import { Boot } from "@wangeditor/editor";
import {
  CLEAR_STYLE_ICON_SVG,
  COLOR_PANEL_DEFS,
  EMPTY_VALUE,
  SELECT_MENU_DEFS,
  TOGGLE_MENU_DEFS,
} from "./variableStyleConstants";
import { createColorPanelElement } from "./variableColorPanel";
import {
  getColorList,
  getConfigList,
  EMPTY_VARIABLE_STYLE_PATCH,
  isVariableSelectionDisabled,
  normalizeSelectOptions,
  patchSelectedVariableStyle,
  readStyleValue,
} from "./variableStyleHelpers";

/**
 * 开关类菜单（加粗/斜体/下划线/删除线）。
 */
class VariableToggleStyleMenu {
  constructor({ key, title, iconSvg, styleKey }) {
    this.key = key;
    this.title = title;
    this.iconSvg = iconSvg;
    this.tag = "button";
    this.styleKey = styleKey;
  }

  getValue(editor) {
    return !!readStyleValue(editor, this.styleKey, false);
  }

  isActive(editor) {
    return this.getValue(editor);
  }

  isDisabled(editor) {
    return isVariableSelectionDisabled(editor);
  }

  exec(editor) {
    patchSelectedVariableStyle(editor, { [this.styleKey]: !this.getValue(editor) });
  }
}

/**
 * 选择类菜单（字号/字体），候选项来自内置 MENU_CONF。
 */
class VariableSelectStyleMenu {
  constructor({ key, title, iconSvg, styleKey, configKey, listKey, defaultLabel }) {
    this.key = key;
    this.title = title;
    this.iconSvg = iconSvg;
    this.tag = "select";
    this.styleKey = styleKey;
    this.configKey = configKey;
    this.listKey = listKey;
    this.defaultLabel = defaultLabel;
  }

  getValue(editor) {
    return readStyleValue(editor, this.styleKey, EMPTY_VALUE);
  }

  isActive(editor) {
    return !!this.getValue(editor);
  }

  isDisabled(editor) {
    return isVariableSelectionDisabled(editor);
  }

  getOptions(editor) {
    return normalizeSelectOptions(
      getConfigList(editor, this.configKey, this.listKey),
      this.defaultLabel,
    );
  }

  exec(editor, value) {
    patchSelectedVariableStyle(editor, { [this.styleKey]: value || EMPTY_VALUE });
  }
}

/**
 * 颜色面板菜单（颜色/背景色）。
 */
class VariableColorPanelMenu {
  constructor({ key, title, iconSvg, styleKey, configKey }) {
    this.key = key;
    this.title = title;
    this.iconSvg = iconSvg;
    this.tag = "button";
    this.showDropPanel = true;
    this.styleKey = styleKey;
    this.configKey = configKey;
  }

  getValue(editor) {
    return readStyleValue(editor, this.styleKey, EMPTY_VALUE);
  }

  isActive(editor) {
    return !!this.getValue(editor);
  }

  isDisabled(editor) {
    return isVariableSelectionDisabled(editor);
  }

  exec(editor, value) {
    patchSelectedVariableStyle(editor, { [this.styleKey]: value || EMPTY_VALUE });
  }

  getPanelContentElem(editor) {
    return createColorPanelElement({
      colors: getColorList(editor, this.configKey),
      activeColor: this.getValue(editor),
      onSelect: (value) => {
        this.exec(editor, value);
        editor.hidePanelOrModal();
      },
    });
  }
}

/**
 * 清空变量样式菜单。
 */
class VariableResetStyleMenu {
  constructor() {
    this.title = "清空变量样式";
    this.iconSvg = CLEAR_STYLE_ICON_SVG;
    this.tag = "button";
  }

  getValue() {
    return false;
  }

  isActive() {
    return false;
  }

  isDisabled(editor) {
    return isVariableSelectionDisabled(editor);
  }

  exec(editor) {
    patchSelectedVariableStyle(editor, EMPTY_VARIABLE_STYLE_PATCH);
  }
}

/**
 * 注册变量样式菜单。颜色/字号/字体配置复用内置 MENU_CONF。
 */
export const registerVariableStyleMenus = () => {
  TOGGLE_MENU_DEFS.forEach((def) => {
    Boot.registerMenu({
      key: def.key,
      factory: () => new VariableToggleStyleMenu(def),
    });
  });

  COLOR_PANEL_DEFS.forEach((def) => {
    Boot.registerMenu({
      key: def.key,
      factory: () => new VariableColorPanelMenu(def),
    });
  });

  SELECT_MENU_DEFS.forEach((def) => {
    Boot.registerMenu({
      key: def.key,
      factory: () => new VariableSelectStyleMenu(def),
    });
  });

  Boot.registerMenu({
    key: "variableClearStyle",
    factory: () => new VariableResetStyleMenu(),
  });
};
