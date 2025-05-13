// 导出所有 API 模块
import * as auth from './auth';
import * as common from './common';
import * as generate from './generate';
import * as token from './token';
import * as tryOn from './tryon';
import * as magicKit from './magicKit';
// 导出为命名空间
export { auth, common, generate, token, tryOn, magicKit };

// 也可以直接导出所有函数，但可能会导致命名冲突
export * from './auth';
export * from './common';
export * from './token';
export * from './generate';
export * from './tryon';
export * from './magicKit';
