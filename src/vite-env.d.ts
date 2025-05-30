/// <reference types="vite/client" />

/**
 * 环境变量类型声明
 *
 * 这些声明使得TypeScript能够识别通过Vite注入的环境变量
 * 需要在vite.config.ts中配置对应的envPrefix和define
 */

/**
 * 部署环境标识变量
 * @description 用于区分不同的部署环境
 * @example 'pages' - 表示部署在GitHub Pages环境
 * @example 'vercel' - 表示部署在Vercel环境
 * @default ''
 */
declare const REACT_APP_DEPLOY_ENV: string

/**
 * 最新Git提交哈希
 * @description 用于标识当前部署版本的代码提交
 * @example 'a1b2c3d' - 7位短哈希值
 * @default ''
 *
 * 使用场景:
 * 1. 版本追踪和调试
 * 2. 缓存清除策略
 * 3. 部署状态展示
 */
declare const LATEST_COMMIT_HASH: string
