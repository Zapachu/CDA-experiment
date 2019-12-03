import { Bridge, CONFIG, SceneName, Util } from '../const'
import { asset, assetName } from '../asset'
import { BaseScene } from './BaseScene'

export class Match extends BaseScene {
  playerSection: PlayerSection
  universitySection: UniversitySection
  offer: Offer

  constructor() {
    super({ key: SceneName.match })
  }

  preload() {
    this.load.atlas(assetName.matchTexture, asset.matchTexture, asset.matchAtlas)
  }

  create() {
    this.add.graphics({ lineStyle: { color: 0x666666, alpha: 0.1, width: 4 } }).strokeRect(125, 145, 750, 1334)
    this.playerSection = new PlayerSection(this, 0, 200)
    this.universitySection = new UniversitySection(this, 0, 500)
    this.offer = new Offer(this, 500, 700, '浙江大学')
  }

  update() {
    super.update()
    const {
      playerState: { offer }
    } = Bridge.props
    if (offer !== undefined && !this.offer.envelopeMask.visible) {
      this.offer.showUp()
    }
  }
}

enum PlayerColor {
  gray = 0x999999,
  red = 0xff3312,
  blue = 0x1c4ed3
}

class PlayerSection extends Phaser.GameObjects.Container {
  readonly playerY: number = 100
  statusTips: Phaser.GameObjects.Text

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.add(new Player(scene, 195, this.playerY, PlayerColor.gray))
    this.add(new Player(scene, 310, this.playerY, PlayerColor.gray))
    this.add(new CurPlayer(scene, 500, this.playerY, 14, 645))
    this.add(new Player(scene, 690, this.playerY, PlayerColor.blue))
    this.add(new Player(scene, 805, this.playerY, PlayerColor.red))
    this.statusTips = scene.add
      .text(500, 450, '正在根据考生分数由高到低进行录取，请耐心等候...', {
        fontSize: '26px',
        fontFamily: 'Open Sans',
        color: '#000'
      })
      .setOrigin(0.5)
    scene.add.existing(this)
  }
}

class Player extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number, color: PlayerColor) {
    super(scene, x, y)
    const sprite = scene.add.sprite(0, 0, assetName.matchTexture, 'smile').setTintFill(color)
    this.add(sprite)
    this.add(scene.add.graphics({ lineStyle: { width: 4, color: 0 } }).strokeCircle(0, 0, 42))
    scene.add.existing(this)
  }
}

class CurPlayer extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number, seq: number, score: number) {
    super(scene, x, y)
    const fontStyle = {
      fontSize: '32px',
      fontFamily: 'Open Sans',
      color: '#696969'
    }
    this.add(scene.add.sprite(0, 0, assetName.matchTexture).setOrigin(0.5))
    this.add(scene.add.text(0, 0, '组员:', fontStyle).setOrigin(1, 1))
    this.add(scene.add.text(20, 0, seq.toString(), { ...fontStyle, color: '#ff3312' }).setOrigin(0, 1))
    this.add(scene.add.text(0, 45, '成绩:', fontStyle).setOrigin(1, 1))
    this.add(scene.add.text(10, 45, score.toString(), { ...fontStyle, color: '#ff3312' }).setOrigin(0, 1))
    scene.add.existing(this)
  }
}

class UniversitySection extends Phaser.GameObjects.Container {
  universityBoxes: UniversityBox[]
  miniUniversityBoxes: MiniUniversityBox[]

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.universityBoxes = CONFIG.universities.map(
      (_, i) => new UniversityBox(scene, 260 + (i % 3) * 240, 190 + ~~(i / 3) * 220, i)
    )
    this.universityBoxes.map((u, i) => u.setIsActive(!!(i % 2)))
    this.miniUniversityBoxes = [2, 5, 7].map(
      (index, i) => new MiniUniversityBox(scene, 130 + i * 250, 0, index, !!(i % 2))
    )
    this.add([...this.universityBoxes, ...this.miniUniversityBoxes])
    scene.add.existing(this)
  }
}

class MiniUniversityBox extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number, i: number, active?: boolean) {
    super(scene, x, y)
    const { name, quota } = CONFIG.universities[i]
    const BG = {
      width: 240,
      height: 60,
      radius: 12
    }
    this.add(
      scene.add
        .graphics({ fillStyle: { color: active ? 0xff3312 : 0x00b6f4 }, lineStyle: { color: 0x0, width: 4 } })
        .fillRoundedRect(0, 0, BG.width, BG.height, BG.radius)
        .strokeRoundedRect(0, 0, BG.width, BG.height, BG.radius)
    )
    this.add(
      scene.add
        .text(120, 30, `${name}招录: ${quota}`, {
          font: '24px Open Sans'
        })
        .setOrigin(0.5, 0.5)
    )
    scene.add.existing(this)
  }
}

class UniversityBox extends Phaser.GameObjects.Container {
  bg: Phaser.GameObjects.Rectangle
  border: Phaser.GameObjects.Sprite
  nameText: Phaser.GameObjects.Text
  quota: Phaser.GameObjects.Text
  applicationText: Phaser.GameObjects.Text
  applicationBg: Phaser.GameObjects.Rectangle

  constructor(public scene: Phaser.Scene, x: number, y: number, i: number, applicationIndex: number = 1) {
    super(scene, x, y)
    const { name, quota } = CONFIG.universities[i]
    this.bg = scene.add.rectangle(0, 0, 200, 200, 0xffffff)
    this.border = scene.add.sprite(0, 0, assetName.matchTexture, '2').setOrigin(0.5)
    this.nameText = scene.add
      .text(0, 0, name, {
        font: 'bold 36px Open Sans',
        color: '#1c4ed3',
        wordWrap: { width: 150, useAdvancedWrap: true }
      })
      .setOrigin(0.5, 0.5)
    this.quota = scene.add
      .text(0, 60, `录取名额：${quota}`, {
        font: '24px Open Sans',
        color: '#000'
      })
      .setOrigin(0.5, 0.5)
    this.applicationBg = scene.add.rectangle(0, -65, 160, 32).setVisible(applicationIndex > -1)
    this.applicationBg.mask = this.createGeometryMask(
      scene.make
        .graphics({
          x,
          y: y + 420
        })
        .fillRoundedRect(-80, 0, 160, 32, 10)
    )
    this.applicationText = scene.add
      .text(0, -65, `我的第${Util.index2ChineseNumber(applicationIndex)}志愿`, {
        font: '24px Open Sans'
      })
      .setOrigin(0.5, 0.5)
      .setVisible(applicationIndex > -1)
    this.add([this.bg, this.border, this.nameText, this.quota, this.applicationBg, this.applicationText])
    scene.add.existing(this)
  }

  setIsActive(b: boolean) {
    this.bg.setFillStyle(b ? 0xff3312 : 0xffffff)
    this.nameText.setColor(b ? '#fff' : '#1c4ed3')
    this.quota.setColor(b ? '#fff' : '#000')
    this.applicationText.setColor(b ? '#ff3312' : '#fff')
    this.applicationBg.setFillStyle(b ? 0xffffff : 0xff3312)
  }
}

class Offer extends Phaser.GameObjects.Container {
  scale = 0
  envelopeMask: Phaser.GameObjects.Graphics

  constructor(public scene: Phaser.Scene, x: number, y: number, label: string) {
    super(scene, x, y)
    this.envelopeMask = this.scene.add
      .graphics({
        fillStyle: {
          color: 0x0,
          alpha: 0.7
        }
      })
      .fillRect(0, 0, 1000, 1624)
      .setVisible(false)
    this.add([
      scene.add.sprite(0, 100, assetName.matchTexture, 'offer'),
      scene.add
        .text(50 - label.length * 19, 0, '恭喜您被', {
          font: '35px Open Sans',
          fill: '#333'
        })
        .setOrigin(1, 0.5),
      scene.add
        .text(50, 0, label, {
          font: '35px Open Sans',
          fill: '#ff3312'
        })
        .setOrigin(0.5, 0.5),
      scene.add
        .text(50 + label.length * 19, 0, '录取', {
          font: '35px Open Sans',
          fill: '#333'
        })
        .setOrigin(0, 0.5)
    ])
    scene.add.existing(this)
  }

  showUp() {
    this.envelopeMask.visible = true
    this.scene.tweens.add({
      targets: [this],
      scale: { from: 0.3, to: 1 },
      duration: 2e2
    })
  }
}
