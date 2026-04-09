function PreviewCard({
  // 富文本 HTML 内容
  html,
}) {
  return (
    <section className="editor-demo-card panel-card preview-card">
      <header className="panel-card-header">
        <h3 className="panel-card-title">HTML 预览</h3>
      </header>
      <div className="preview-content">{html}</div>
    </section>
  );
}

export default PreviewCard;
