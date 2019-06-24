class Main extends BaseMain {
    sceneClasses: Array<{ new(): Scene }> = [Prepare, Trade, Result]
}