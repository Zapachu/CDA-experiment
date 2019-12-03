import { Bridge } from '../const'

export class BaseScene extends Phaser.Scene {
  update() {
    const {
      playerState: { scene }
    } = Bridge.props
    if (scene !== this.scene.key) {
      this.scene.start(scene)
    }
  }
}
