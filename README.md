# Experiment Link Framework

## 项目结构
  - 仓库由多个pkg组成，用lerna维护其版本与相互间依赖
  - 为方便pkg间联调debug，暂均直接通过ts-node运行ts源码
  - - linker ：调度管理模块，各phaseProxy启动后定时向其发送心跳(更新注册信息)
    - proto ：系统间rpc接口声明，并提供接口函数的封装
    - bespoke
        - core : 定制实验框架
        - game ：单个定制实验，可在各自目录内生成前端打包文件，启动独立进程,仅在内网暴露端口，由proxy对外提供访问
    - proxy
      - bespoke : 定制实验反向代理，通过解析request.url分发请求至指定gameServer,未找到指定server时随机路由
      - thirdPartyPhase : 与bespokeGame平级,向linker注册所代理的第三方页面，详见thirdPartyPhase/README.MD


## 首次运行
 - `npx lerna init`
 - `cd linker`
   - `npm run client:dist`
   - `npm run server:ts-serve`
 - `cd proxy/bespoke`
   - `go build ./server.go`
   - `./server.exe`
 - `cd proxy/thirdPartyPhase`
   - `npm run otree:dist` 
   - `npm run otree`
   - `npm run wjx:dist`
   - ...
 - `cd bespoke`
   - `npm run core:dist`
   - `cd VickreyAuction2`
   - `ts-node ./script/buildClient.ts`
   - `ts-node ./src/serve.ts`
