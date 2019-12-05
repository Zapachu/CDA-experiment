import { Bridge, MoveType, SceneName } from '../const'

export class BaseScene extends Phaser.Scene {
  constructor(arg = { key: SceneName.boot }) {
    super(arg)
  }

  create() {
    Bridge.emitter.emit(MoveType.init)
  }

  update() {
    const {
      playerState: { scene }
    } = Bridge.props
    if (scene !== this.scene.key) {
      this.scene.start(scene)
    }
  }
}
