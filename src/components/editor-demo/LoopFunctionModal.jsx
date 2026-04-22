import { useEffect, useState } from "react";
import { Form, Modal } from "antd";
import MentionInput from "./MentionInput";

const hasInputValue = (value) => {
  return Boolean(String(value || "").trim());
};

const normalizeInputValue = (value) => {
  return String(value || "").trim();
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

  const validateVariableField = (_, value) => {
    if (!hasInputValue(value)) {
      return Promise.reject(new Error("请输入内容"));
    }

    return Promise.resolve();
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    try {
      setSaving(true);
      await onSave?.({
        variableName: normalizeInputValue(values.variableName),
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
          <MentionInput variables={variables} placeholder="请输入变量" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoopFunctionModal;
