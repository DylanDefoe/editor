import { Boot } from "@wangeditor/editor";
import elemToHtmlConf from "./elem-to-html";
import parseElemHtmlConf from "./parse-elem-html";
import withVariable from "./plugin";
import renderElemConf from "./render-elem";
import { registerVariableStyleMenus } from "./menu";

/**
 * 注册 variable 模块：节点渲染、序列化、解析、编辑器插件与样式菜单。
 */
export const registerVariableModule = () => {
  Boot.registerRenderElem(renderElemConf);
  Boot.registerElemToHtml(elemToHtmlConf);
  Boot.registerParseElemHtml(parseElemHtmlConf);
  Boot.registerPlugin(withVariable);
  registerVariableStyleMenus();
};
