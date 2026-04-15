export const CONDITION_OPERATORS = [">=", "<=", "==", "!=", ">", "<"];

/**
 * 规范化条件左右值，移除空白和开头 mention 前缀。
 */
export const normalizeOperand = (value) => {
  return (value || "").trim().replace(/^@+/, "");
};

/**
 * 将条件拆解成 left/operator/right 三段，供表单回填使用。
 */
export const parseConditionToFields = (condition) => {
  const normalizedCondition = String(condition || "").trim();

  if (!normalizedCondition) {
    return {
      leftOperand: "",
      operator: undefined,
      rightOperand: "",
    };
  }

  for (const operator of CONDITION_OPERATORS) {
    const index = normalizedCondition.indexOf(operator);

    if (index <= 0) {
      continue;
    }

    const leftOperand = normalizedCondition.slice(0, index).trim();
    const rightOperand = normalizedCondition
      .slice(index + operator.length)
      .trim();

    if (leftOperand && rightOperand) {
      return {
        leftOperand,
        operator,
        rightOperand,
      };
    }
  }

  return {
    leftOperand: normalizedCondition,
    operator: undefined,
    rightOperand: "",
  };
};

/**
 * 由表单值构造最终 condition。
 */
export const buildConditionFromFields = ({
  leftOperand,
  operator,
  rightOperand,
}) => {
  return `${normalizeOperand(leftOperand)} ${operator} ${normalizeOperand(rightOperand)}`;
};
