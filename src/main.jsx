import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/antd.css'
import '@wangeditor/editor/dist/css/style.css'
import './index.css'
import './modules/variableModule.js' // 注册变量模块
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
