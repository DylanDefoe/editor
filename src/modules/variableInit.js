import { registerVariableElement } from "./variableModule";
import { registerVariableStyleMenus } from "./variableStyleMenus";
import { registerIfFunctionElements } from "./ifFunctionModule";

// 注册变量元素
registerVariableElement();

// 注册函数标签元素
registerIfFunctionElements();

// 注册变量样式菜单
registerVariableStyleMenus();
