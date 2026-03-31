import { Card, Empty } from "antd";

function PreviewCard({
  // 富文本 HTML 内容
  html,
}) {
  return (
    <Card title="HTML 预览" className="editor-demo-card preview-card">
      <div className="preview-content">{html}</div>
    </Card>
  );
}

export default PreviewCard;
