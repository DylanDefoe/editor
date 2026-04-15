import { registerVariableModule } from "./variable";
import { registerIfFunctionModule } from "./ifFunction";
import { registerJoinFunctionModule } from "./joinFunction";

// 注册变量模块
registerVariableModule();

// 注册函数标签元素
registerIfFunctionModule();

// 注册 JOIN 函数元素
registerJoinFunctionModule();
