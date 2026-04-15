import { StrictMode } from "react";
import { render } from "react-dom";
import "antd/dist/antd.css";
import "@wangeditor/editor/dist/css/style.css";
import "./index.css";
import "./modules";
import App from "./App.jsx";
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from "antd";

render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
  document.getElementById("root"),
);
