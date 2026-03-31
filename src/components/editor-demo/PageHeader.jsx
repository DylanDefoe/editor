import { Typography } from 'antd'

const { Title, Paragraph } = Typography

function PageHeader({
  // 页面主标题文本
  title,
  // 页面说明文本
  description,
}) {
  return (
    <div className="editor-demo-header">
      <Title level={2} style={{ marginBottom: 8 }}>
        {title}
      </Title>
      <Paragraph style={{ marginBottom: 0 }}>{description}</Paragraph>
    </div>
  )
}

export default PageHeader
