# 首次启动
- `npm install typescript ts-node protobufjs -g`
- 新建*lib\core\server\config\settings.ts*配置文件
- `npm install`
- `npm run game:dist --namespace=ContinuousDoubleAuction`
- `npm run core:dist`
- `npm run server:ts-serve`

# 调试
- 前端 : `npm run game:build --namespace=ContinuousDoubleAuction`
- 后端 : `node --inspect -r ts-node/register lib\core\server\server.ts`

# 更新
- `npm install`
- `npm run game:dist --namespace=ContinuousDoubleAuction`
- `npm run core:dist`
- `npm run server:ts-serve`

# 更新发布
- `npm install --production`
- `npm run game:publish --namespace=ContinuousDoubleAuction`
- `npm run core:publish`
- `npm run server:serve`

# 项目结构
```
├─game001
├─game002
...
├─core
│  ├─client
│  ├─config
│  └─server
└─dist
```
- core分为3个独立的npm包，已被加入顶层package.json依赖

    dir | npm | description
    ---- | --- | ---
    client | bespoke-client | 前端
    config | @common | 全局配置
    server | server-vendor | 后端

- 游戏由创建者自由定制组织一系列环节(phase)而生成，故各phase应尽可能相互独立

![新增环节](http://opcwhq4gm.bkt.clouddn.com/18-5-17/92742204.jpg)
![多环节拼接成一场实验](http://opcwhq4gm.bkt.clouddn.com/18-5-17/67669917.jpg)

- 项目前端代码最终被打包至dist目录下
    ```
    └─dist
        core.client.hash.js
        core.client.json
        core.config.hash.js
        core.config.json
        game002.hash.js
        game002.json
    ```

- 以game002为例，与game002相关的所有文件均被组织在game002目录下，核心为view(前端)、controller.js(后端)
```
    ├─script
    │      entry.client.js (webpack入口, 调用bespoke-client.renderRoot 打包生成game002.hash.js)
    ├─src
    │  │  config.js (i18n字典、玩家动作声明、游戏phase声明... + 自定义配置)
    │  │  Controller.js (后端逻辑)
    │  │  Robot.js (后端机器人)
    │  └─view
    │          index.js (phase无关的前端逻辑与渲染)
    │          baseInfo.js (单个phase模板, 通常包含Meta/Create/Info/Play四部分)
    │          ...
    │          comprehensionTest.js
    │          informalGameEnding.js
    │          mainGame.js
    │          style.scss
    └─test (单元测试)
```

# 数据结构与通信
- 表结构见./core/server/src下interface与model目录
- 游戏过程中server在StateManager.ts内为游戏维护一份gameState, 为每位玩家维护一份playerState，两者数据结构相似，组合得到前端可见的游戏状态。当前端发来move, 会触发后端reducer改变gameState与playerState, 框架将diff的state merge回前端，即完成一次交互
- 前端状态由redux维护，其结构与后端playerState相似，故可直接merge后端的diffState
    - player : state = merge(gameConfig , playerState , view on gameState)
    - owner : state = merge(gameConfig, gameState) + playerStates

# 开发

## game002/src/config.js
  - phaseNames : phase模板名
  - languageDict : i18n字典,声明后以`lang.submit`形式调用
  - MoveType : 前端可触发的move声明，用于游戏过程中与后端的交互,声明后以`moves.typeName()`调用

## BaseView
  game002/src/view/index.js基类，提供phase无关的接口供游戏覆写，主要方法：
  - `checkPhases` : 创建实验时phases检查
  - `renderPlay4Owner` : 控制台MonitorTab渲染，用于教师在游戏过程中参与互动
  - `renderResultXXX` : 游戏结果渲染
  - `formatXXXLog` : 控制台LogTab日志格式化

## BasePhase
  所有自定义phase的原型，提供Meta、Create、Info、Play四个基类供 phase覆写
- Meta : phase元信息
- Create : 
    - `getDefaultParams` : phase默认配置
    - `checkParams` : 检查phase配置
- Info : 配置查看renderer
- Play : 玩家界面渲染
    - 若需重写componentDidMount，先super.componentDidMount()完成框架对组件的启动
    - startRobot启动前端机器人，参考game002
    - render中，对于单轮(多轮)游戏，可调用act.handlePhaseInput(act.handleRoundInput)记录输入

## BaseController
  Controller的抽象父类，声明后端逻辑处理函数签名供游戏实现：
- `getResult` : 抽象函数，必须在游戏中实现，在控制台教师点击结束时计算结果并写入playerState.result内
- `initGameState`/`initPlayerState` : 已有默认实现，可覆写以增强游戏或玩家的初始化状态
- `transGameState4Player` : 已有默认实现，为玩家声明gameState的视图，屏蔽部分不可见的游戏配置
- `fetchHandler` : 对应于FETCH_TYPE的handler
- `playerMoveReducer`/`teacherMoveReducer` :  分别处理来自玩家或控制台的move动作,直接在入参playerStates上修改，然后将其返回即可。其中参数fn内包含`setGameState`/`setPlayerStates`闭包，可随时调用从而主动更新游戏状态，主要用于：游戏倒计时、玩家动作引发gameState更新等

关于游戏初始状态
- 状态每一层都定义了freeField字段，用于存放游戏自定义的数据
- 当游戏配置中含rounds字段，即为多轮游戏，会针对每轮分别初始化，单轮游戏则input/freeField等初始化字段被放在最外层

## BaseRobot
后端机器人父类，每个phase对应一个机器人实例，由core中RobotScheduler.ts调度。
- 机器人实例被赋予user、moves、state(即为浏览器端的reduxStore)等玩家可见的内容），它通过重写mergeDiffState方法，分析state、user和参数diffState做出判断，最后调用moves.someMove向server发起动作
- 机器人在反复生成新定时器时，需先判断this.alive, 为fasle即已被调度器销毁，不可再发起动作，应放弃生成定时器
