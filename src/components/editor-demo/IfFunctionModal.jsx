import { useEffect, useState } from "react";
import { Form, Modal, Select } from "antd";
import MentionInput from "./MentionInput";

const OPERATOR_OPTIONS = ["==", "!=", ">=", "<=", ">", "<"];

/**
 * 将条件拆解成 left/operator/right 三段，供表单回填使用。
 */
const parseConditionToFields = (condition) => {
  const normalizedCondition = String(condition || "").trim();

  if (!normalizedCondition) {
    return {
      leftOperand: "",
      operator: undefined,
      rightOperand: "",
    };
  }

  for (const operator of OPERATOR_OPTIONS) {
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
const buildConditionFromFields = ({ leftOperand, operator, rightOperand }) => {
  return `${leftOperand} ${operator} ${rightOperand}`;
};

const hasInputValue = (value) => {
  return Boolean(String(value || "").trim());
};

const normalizeInputValue = (value) => {
  return String(value || "").trim();
};

/**
 * IF 条件弹窗：收集并回填 left/operator/right，输出规范化 condition。
 */
function IfFunctionModal({
  open,
  variables,
  initialCondition,
  onCancel,
  onSave,
}) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const validateMentionField = (_, value) => {
    if (!hasInputValue(value)) {
      return Promise.reject(new Error("请输入内容"));
    }

    return Promise.resolve();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const condition = buildConditionFromFields({
      ...values,
      leftOperand: normalizeInputValue(values.leftOperand),
      rightOperand: normalizeInputValue(values.rightOperand),
    });

    try {
      setSaving(true);
      await onSave?.({ condition });
      form.resetFields();
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const initialValues = parseConditionToFields(initialCondition);
    form.setFieldsValue(initialValues);
  }, [form, initialCondition, open]);

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={saving}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="leftOperand"
          label="左值"
          rules={[{ validator: validateMentionField }]}
        >
          <MentionInput
            variables={variables}
            placeholder="请输入左操作数"
          />
        </Form.Item>

        <Form.Item
          name="operator"
          label="运算符"
          rules={[{ required: true, message: "请选择运算符" }]}
        >
          <Select
            options={OPERATOR_OPTIONS.map((value) => ({
              value,
              label: value,
            }))}
            placeholder="请选择运算符"
          />
        </Form.Item>

        <Form.Item
          name="rightOperand"
          label="右值"
          rules={[{ validator: validateMentionField }]}
        >
          <MentionInput
            variables={variables}
            placeholder="请输入右操作数"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default IfFunctionModal;
