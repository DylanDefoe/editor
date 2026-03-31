import { VARIABLE_TOKEN_CONFIG } from "../config/editorConfig";

export const buildVariableToken = (key) => {
  if (!key) {
    return "";
  }

  return `${VARIABLE_TOKEN_CONFIG.prefix}${key}${VARIABLE_TOKEN_CONFIG.suffix}`;
};
