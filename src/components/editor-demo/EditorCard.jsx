import PreviewCard from "./PreviewCard";
import RichEditor from "./RichEditor";

/**
 * 单个编辑器卡片：包含编辑器主体与实时 HTML 预览。
 */
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
  // 点击函数开始标签
  onFunctionTagStartClick,
  // 复制当前编辑器
  onCopy,
}) {
  return (
    <section className="editor-demo-card panel-card editor-instance-card">
      <header className="panel-card-header">
        <h2 className="panel-card-title">编辑器 {index + 1}</h2>
        <button type="button" className="btn-primary" onClick={onCopy}>
          复制
        </button>
      </header>

      <div className="editor-card-body">
        <RichEditor
          value={value}
          onChange={onChange}
          onMount={onEditorMount}
          onBeforeInput={onBeforeInput}
          onFunctionTagStartClick={onFunctionTagStartClick}
        />

        <PreviewCard html={value} />
      </div>
    </section>
  );
}
