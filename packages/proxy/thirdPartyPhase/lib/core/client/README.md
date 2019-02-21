## 新建 Phase的基类

> 来源于 Guokan 的 v2.0-phase 新建phase 基类，此处Otree Phase新建方法与Phase类似

### 使用方法

在phase 的 namespace下，定义一下四个文件

```
lib/phase/NAMESPACE(Otree game name)
    ----config.ts  // 枚举、配置文件
    ----logic.ts   // 在此处的 Otree phase 可省略 （来自于 JS Phase Game 的控制）
    ----style.scss // 一些样式文件
    ----view.tsx    // 新建、新建预览、玩家Play界面组件
```

详细的：

在view.tsx 结构中：

```
-----view.tsx
    ----Class Create
        ---renderPreview(): 预览新建的phase
        ---render(): 新建phase视图
    ----Class Play
        ---render(): 渲染玩家Play视图
```