import { useEffect, useMemo, useState } from "react";
import { Form, Mentions, Modal } from "antd";

/**
 * 规范化变量值，移除空白和开头 mention 前缀。
 */
const normalizeOperand = (value) => {
  return (value || "").trim().replace(/^@+/, "");
};

const normalizeMentionOption = (item) => {
  const value = item?.value;
  const label = item?.label ?? value;

  if (value === undefined || value === null || value === "") {
    return null;
  }

  return {
    value,
    label,
  };
};

/**
 * LOOP 条件弹窗：收集并回填变量名。
 */
function LoopFunctionModal({
  // 弹窗开关
  open,
  // 变量列表
  variables,
  // 初始变量名
  initialVariableName,
  // 取消回调
  onCancel,
  // 保存回调
  onSave,
}) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const mentionOptions = useMemo(() => {
    return (variables ?? []).map(normalizeMentionOption).filter(Boolean);
  }, [variables]);

  const validateVariableField = (_, value) => {
    if (!normalizeOperand(value)) {
      return Promise.reject(new Error("请输入内容"));
    }

    return Promise.resolve();
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    try {
      setSaving(true);
      await onSave?.({
        variableName: normalizeOperand(values.variableName),
      });
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

    form.setFieldsValue({
      variableName: initialVariableName || "",
    });
  }, [form, initialVariableName, open]);

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={saving}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="variableName"
          label="变量"
          rules={[{ validator: validateVariableField }]}
        >
          <Mentions
            filterOption={(input, option) => option.label.includes(input)}
            options={mentionOptions}
            placeholder="请输入变量"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoopFunctionModal;
