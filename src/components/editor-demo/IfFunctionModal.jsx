import { useEffect, useMemo, useState } from "react";
import { Form, Mentions, Modal, Select } from "antd";

const OPERATOR_OPTIONS = ["==", "!=", ">", ">=", "<", "<="];
const CONDITION_OPERATORS = [">=", "<=", "==", "!=", ">", "<"];

const normalizeOperand = (value) => {
  return String(value || "")
    .trim()
    .replace(/^@+/, "");
};

const parseConditionToFields = (condition) => {
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

function IfFunctionModal({
  open,
  variables,
  initialCondition,
  onCancel,
  onSave,
}) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const mentionOptions = useMemo(() => {
    return (variables ?? [])
      .map((item) => {
        const value = item?.key ?? item?.value;
        const label = item?.label ?? value;

        if (value === undefined || value === null || value === "") {
          return null;
        }

        return {
          value,
          label,
        };
      })
      .filter(Boolean);
  }, [variables]);

  const validateMentionField = (_, value) => {
    if (!normalizeOperand(value)) {
      return Promise.reject(new Error("请输入内容"));
    }

    return Promise.resolve();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const leftOperand = normalizeOperand(values.leftOperand);
    const operator = values.operator;
    const rightOperand = normalizeOperand(values.rightOperand);
    const condition = `${leftOperand} ${operator} ${rightOperand}`;

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
          <Mentions options={mentionOptions} placeholder="请输入左操作数" />
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
          <Mentions options={mentionOptions} placeholder="请输入右操作数" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default IfFunctionModal;
