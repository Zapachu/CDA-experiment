import { Bridge, MoveType, SceneName } from '../const'

export class BaseScene extends Phaser.Scene {
  toast: Toast

  constructor(arg = { key: SceneName.boot }) {
    super(arg)
  }

  create() {
    if (this.scene.key === SceneName.boot) {
      Bridge.emitter.emit(MoveType.init)
    }
    this.add.graphics({ lineStyle: { color: 0x0, width: 2, alpha: 1 } }).strokeRect(125, 145, 750, 1334)
    this.toast = new Toast(this, 500, 700).setDepth(1e4)
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

class Toast extends Phaser.GameObjects.Container {
  scaleY = 0
  bgGraphics: Phaser.GameObjects.Graphics
  labelContainer: Phaser.GameObjects.Container

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.bgGraphics = scene.add.graphics({
      fillStyle: { color: 0x000, alpha: 0.8 }
    })
    const textStyle = {
      font: '35px Open Sans',
      padding: 5
    }
    this.labelContainer = scene.add.container(0, 0, [
      scene.add.text(0, 0, '', textStyle),
      scene.add.text(0, 0, '', {
        ...textStyle,
        fill: '#ff3312'
      }),
      scene.add.text(0, 0, '', textStyle)
    ])
    this.add([this.bgGraphics, this.labelContainer])
    scene.add.existing(this)
  }

  showUp(left: string, middle: string = '', right: string = '') {
    const [textA, textB, textC] = this.labelContainer.getAll() as Phaser.GameObjects.Text[]
    textA.setText(left)
    textB.x = textA.width
    textB.setText(middle)
    textC.x = textB.x + textB.width
    textC.setText(right)
    const totalWidth = right ? textC.x + textC.width : middle ? textB.x + textB.width : textA.x + textA.width
    this.labelContainer.x = -totalWidth >> 1
    this.bgGraphics.clear().fillRoundedRect(-(totalWidth + 100) / 2, -15, totalWidth + 100, 80, 10)
    this.scene.tweens.add({
      targets: [this],
      scaleY: { from: 0, to: 1 },
      duration: 100,
      hold: 2e3,
      yoyo: true
    })
  }
}
