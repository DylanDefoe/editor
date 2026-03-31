import { Card, Space, Statistic } from 'antd'

function StatsCard({
  // 纯文本长度
  textLength,
  // HTML 字符串长度
  htmlLength,
}) {
  return (
    <Card title="内容统计" size="small" className="editor-demo-card">
      <Space size={24}>
        <Statistic title="纯文本字数" value={textLength} />
        <Statistic title="HTML 长度" value={htmlLength} />
      </Space>
    </Card>
  )
}

export default StatsCard
