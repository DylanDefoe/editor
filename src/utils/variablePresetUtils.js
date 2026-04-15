import { IF_FUNCTION_PRESET_TYPE } from "../config/editorConfig";

/**
 * 判断预设是否为 IF 函数预设。
 */
export const isIfFunctionPreset = (preset) => {
  return preset?.type === IF_FUNCTION_PRESET_TYPE;
};

/**
 * 将变量预设转换为 mention 组件统一结构。
 */
export const toMentionVariable = (preset) => {
  if (!preset?.key) {
    return null;
  }

  return {
    key: preset.key,
    value: preset.key,
    label: preset.label || preset.key,
  };
};

/**
 * 获取可用于 mention 的普通变量（排除 IF 函数预设）。
 */
export const getMentionVariables = (presets = []) => {
  return presets
    .filter((preset) => !isIfFunctionPreset(preset))
    .map(toMentionVariable)
    .filter(Boolean);
};
