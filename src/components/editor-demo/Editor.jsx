
import { Button, Card, Space } from "antd";
import RichTextEditor from "./RichTextEditor";
import PreviewCard from "./PreviewCard";

export default function Editor({
  // 编辑器序号
  index,
  // 编辑器 HTML 内容
  value,
  // 内容变化回调
  onChange,
  // 编辑器创建后回调
  onCreated,
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
          onCreated={onCreated}
          onBeforeInput={onBeforeInput}
        />

        <PreviewCard html={value} />
      </Space>
    </Card>
  );
}
