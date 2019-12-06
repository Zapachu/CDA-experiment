import { Bridge, MoveType, SceneName } from '../const'

export class BaseScene extends Phaser.Scene {
  constructor(arg = { key: SceneName.boot }) {
    super(arg)
  }

  create() {
    Bridge.emitter.emit(MoveType.init)
  }

  drawEdge() {
    this.add.graphics({ lineStyle: { color: 0x0, width: 2, alpha: 0 } }).strokeRect(125, 145, 750, 1334)
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
