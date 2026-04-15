import { useEffect, useMemo, useState } from "react";
import { Form, Input, Mentions, Modal } from "antd";

const normalizeMentionOption = (item) => {
  const value = item?.key ?? item?.value;
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
 * JOIN 弹窗：收集并回填 variableName/separator。
 */
function JoinFunctionModal({
  // 弹窗是否打开
  open,
  // 变量候选项
  variables,
  // 初始表单值
  initialValues,
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

  const validateVariableName = (_, value) => {
    const normalizedValue = String(value || "").trim().replace(/^@+/, "");
    if (!normalizedValue) {
      return Promise.reject(new Error("请输入变量"));
    }

    return Promise.resolve();
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    try {
      setSaving(true);
      await onSave?.({
        variableName: String(values.variableName || "").trim().replace(/^@+/, ""),
        separator: String(values.separator || ""),
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
      variableName: initialValues?.variableName || "",
      separator: initialValues?.separator || "",
    });
  }, [form, initialValues, open]);

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
          rules={[{ validator: validateVariableName }]}
        >
          <Mentions
            filterOption={(input, option) => option.label.includes(input)}
            options={mentionOptions}
            placeholder="请输入变量名"
          />
        </Form.Item>

        <Form.Item
          name="separator"
          label="分隔符"
          rules={[{ required: true, message: "请输入分隔符" }]}
        >
          <Input placeholder="请输入分隔符" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default JoinFunctionModal;

