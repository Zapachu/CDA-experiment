# Experiment Link Framework

## 项目结构
  - 仓库由多个pkg组成，用lerna维护其版本与相互间依赖
  - - linker ：调度管理模块，各phaseProxy启动后定时向其发送心跳(更新注册信息)
    - protocol ：系统间数据交换协议(RPC接口封装,Schema结构声明等)
    - bespoke
        - core : 定制实验框架
        - game ：单个定制实验，可在各自目录内生成前端打包文件，启动独立进程,仅在内网暴露端口，由proxy对外提供访问
    - proxy
      - bespoke : 定制实验反向代理，通过解析request.url分发请求至指定gameServer,未找到指定server时随机路由
      - thirdPartyPhase : 与bespokeGame平级,向linker注册所代理的第三方页面，详见thirdPartyPhase/README.MD

## 初始
 - 新建`packages/setting/src/setting.ts`
 - `npm i`

## 定制实验开发
 - `cd ./bespoke/game`
 - `npm run help` (`build`:打包前端，`serve`:以指定port启动gameServer, 详见 /bin/help.ts)

## 定制实验Proxy
 - `cd proxy/bespoke/bin`
   - `./server.exe`
 - `cd ./bespoke/game`
   - 实验前端打包(dist/publish模式)
   - 实验后端添加环境变量`BESPOKE_WITH_PROXY=true`启动serve.ts

## Linker
 - `cd linker`
   - `npm run client:dist`
   - `npm run server:ts-serve`
 - 启动*定制实验Proxy*,实验后端添加环境变量`BESPOKE_WITH_LINKER=true`启动serve.ts
 - `cd proxy/thirdPartyPhase`
   - `npm run otree:dist`
   - `npm run otree`
   - `npm run wjx:dist`
   - ...

