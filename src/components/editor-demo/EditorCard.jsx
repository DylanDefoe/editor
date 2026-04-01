import { Button, Card, Space } from "antd";
import PreviewCard from "./PreviewCard";
import RichTextEditor from "./RichTextEditor";

export default function EditorCard({
  // 编辑器序号
  index,
  // 编辑器 HTML 内容
  value,
  // 内容变化回调
  onChange,
  // 编辑器实例挂载回调，返回值可选为销毁清理函数
  onEditorMount,
  // beforeinput 事件回调
  onBeforeInput,
  // 复制当前编辑器
  onCopy,
}) {
  return (
    <Card
      title={`编辑器 ${index + 1}`}
      extra={
        <Button type="primary" onClick={onCopy}>
          复制
        </Button>
      }
      className="editor-demo-card"
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <RichTextEditor
          value={value}
          onChange={onChange}
          onMount={onEditorMount}
          onBeforeInput={onBeforeInput}
        />

        <PreviewCard html={value} />
      </Space>
    </Card>
  );
}
