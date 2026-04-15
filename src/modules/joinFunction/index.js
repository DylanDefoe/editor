import { Boot } from "@wangeditor/editor";
import elemToHtmlConf from "./elem-to-html";
import parseElemHtmlConf from "./parse-elem-html";
import withJoinFunction from "./plugin";
import renderElemConf from "./render-elem";

/**
 * 注册 joinFunction 模块：渲染、序列化、解析与插件。
 */
export const registerJoinFunctionModule = () => {
  Boot.registerRenderElem(renderElemConf);
  Boot.registerElemToHtml(elemToHtmlConf);
  Boot.registerParseElemHtml(parseElemHtmlConf);
  Boot.registerPlugin(withJoinFunction);
};

