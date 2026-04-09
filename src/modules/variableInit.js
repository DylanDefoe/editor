import { registerVariableElement } from "./variableModule";
import { registerVariableStyleMenus } from "./variableStyleMenus";
import { registerFunctionTagElements } from "./functionTagModule";

// 注册变量元素
registerVariableElement();

// 注册函数标签元素
registerFunctionTagElements();

// 注册变量样式菜单
registerVariableStyleMenus();
