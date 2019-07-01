# Bespoke定制实验

## 项目结构
- core : 业务逻辑框架
- game ：单个定制实验，可在各自目录内生成前端打包文件，启动独立进程,仅在内网暴露端口，由proxy对外提供访问
- proxy : openResty反向代理脚本
- robot : 机器人框架，通过IPC与业务逻辑server通信
- share : 前后端共享的常量、接口、枚举等

## 开发
- 参考 `Example`下脚手架与演示代码
- 通过`npm run help`执行前端打包、后端启动等任务
- 前端HMR ： `npm run help`中前后端均打开HMR即可
- 后端断点调试 : IDE中配置启动方式 `node --inspect -r ts-node/register xxx\server.ts`