import { registerVariableModule } from "./variable";
import { registerIfFunctionModule } from "./ifFunction";
import { registerJoinFunctionModule } from "./joinFunction";
import { registerLoopFunctionModule } from "./loopFunction";

// 注册变量模块
registerVariableModule();

// 注册函数标签元素
registerIfFunctionModule();

// 注册 JOIN 函数元素
registerJoinFunctionModule();

// 注册 LOOP 函数元素
registerLoopFunctionModule();
