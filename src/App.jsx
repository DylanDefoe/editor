import EditorDemo from './components/editor-demo/EditorDemo'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <EditorDemo />
    </ErrorBoundary>
  )
}

export default App
