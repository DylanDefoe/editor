import {
  IF_FUNCTION_PRESET_TYPE,
  LOOP_FUNCTION_PRESET_TYPE,
  JOIN_FUNCTION_PRESET_TYPE,
} from "../config/variable";

/**
 * 判断预设是否为 IF 函数预设。
 */
export const isIfFunctionPreset = (preset) => {
  return preset?.type === IF_FUNCTION_PRESET_TYPE;
};

/**
 * 判断预设是否为 JOIN 函数预设。
 */
export const isJoinFunctionPreset = (preset) => {
  return preset?.type === JOIN_FUNCTION_PRESET_TYPE;
};

/**
 * 判断预设是否为 LOOP 函数预设。
 */
export const isLoopFunctionPreset = (preset) => {
  return preset?.type === LOOP_FUNCTION_PRESET_TYPE;
};

/**
 * 判断预设是否为函数预设（IF/LOOP/JOIN）。
 */
export const isFunctionPreset = (preset) => {
  return (
    isIfFunctionPreset(preset) ||
    isLoopFunctionPreset(preset) ||
    isJoinFunctionPreset(preset)
  );
};

/**
 * 将变量预设转换为 mention 组件统一结构。
 */
export const toMentionVariable = (preset) => {
  if (!preset?.value) {
    return null;
  }

  return {
    value: preset.value,
    label: preset.label || preset.value,
  };
};

/**
 * 获取可用于 mention 的普通变量（排除 IF 函数预设）。
 */
export const getMentionVariables = (presets = []) => {
  return presets
    .filter((preset) => !isFunctionPreset(preset))
    .map(toMentionVariable)
    .filter(Boolean);
};
