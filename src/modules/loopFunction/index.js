import { Boot } from "@wangeditor/editor";
import elemToHtmlConfs from "./elem-to-html";
import parseElemHtmlConfs from "./parse-elem-html";
import withLoopFunction from "./plugin";
import renderElemConfs from "./render-elem";

/**
 * 注册 loopFunction 模块：start/end 渲染、序列化、解析与插件。
 */
export const registerLoopFunctionModule = () => {
  renderElemConfs.forEach((conf) => {
    Boot.registerRenderElem(conf);
  });

  elemToHtmlConfs.forEach((conf) => {
    Boot.registerElemToHtml(conf);
  });

  parseElemHtmlConfs.forEach((conf) => {
    Boot.registerParseElemHtml(conf);
  });

  Boot.registerPlugin(withLoopFunction);
};

