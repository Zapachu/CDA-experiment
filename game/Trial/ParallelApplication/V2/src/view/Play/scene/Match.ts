import { Bridge, CONFIG, PushType, SceneName, Util } from '../const'
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
    super.create()
    this.playerSection = new PlayerSection(this, 0, 200)
    this.universitySection = new UniversitySection(this, 0, 500)
    this.offer = new Offer(this, 500, 700)
    Bridge.emitter.on(PushType.match, ({ rank, score, applications, applicationIndex }) => {
      if (!this.scene.isActive()) {
        return
      }
      this.universitySection.setMatching(applications, applications[applicationIndex])
      this.playerSection.match(
        rank,
        score.reduce((m, n) => m + n),
        rank === Bridge.props.playerState.rank
      )
    })
    Bridge.emitter.on(PushType.apply, ({ rank, universityIndex }) => {
      if (!this.scene.isActive()) {
        return
      }
      this.universitySection.apply(universityIndex)
      const { name } = CONFIG.universities[universityIndex]
      if (rank === Bridge.props.playerState.rank) {
        this.offer.showUp(name)
      } else {
        this.toast.showUp(`玩家${rank + 1}被`, name, '录取')
      }
    })
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
  players: Player[]

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.players = Array(CONFIG.groupSize)
      .fill(null)
      .map((_, i) => new Player(scene, 500, this.playerY, PlayerColor.gray))
    this.statusTips = scene.add
      .text(500, 250, '', {
        fontSize: '26px',
        fontFamily: 'Open Sans',
        color: '#000'
      })
      .setOrigin(0.5)
    this.add([...this.players, this.statusTips])
    scene.add.existing(this)
  }

  match(rank: number, score: number, isMe: boolean) {
    this.statusTips.setText(isMe ? '终于轮到你了' : '正在根据考生分数由高到低进行录取，请耐心等候...')
    this.players.forEach((p, i) => {
      if (rank === i) {
        p.setMatching(true, rank === Bridge.props.playerState.rank ? PlayerColor.red : PlayerColor.blue, rank, score)
      } else {
        p.setMatching(false, i < rank ? PlayerColor.gray : PlayerColor.blue)
      }
      this.scene.tweens.add({
        targets: [p],
        x: 500 + (i - rank) * 110 + 100 * (i < rank ? -1 : i > rank ? 1 : 0),
        duration: 200
      })
    })
  }
}

class Player extends Phaser.GameObjects.Container {
  matchingContainer: Phaser.GameObjects.Container
  normalContainer: Phaser.GameObjects.Container
  lastMatch: boolean

  constructor(public scene: Phaser.Scene, x: number, y: number, color: PlayerColor) {
    super(scene, x, y)
    const fontStyle = {
      fontSize: '32px',
      fontFamily: 'Open Sans',
      color: '#696969'
    }
    this.matchingContainer = scene.add
      .container(0, 0, [
        scene.add.sprite(0, 0, assetName.matchTexture).setOrigin(0.5),
        scene.add.text(0, 0, '组员:', fontStyle).setOrigin(1, 1),
        scene.add.text(20, 0, '', { ...fontStyle, color: '#ff3312' }).setOrigin(0, 1),
        scene.add.text(0, 45, '成绩:', fontStyle).setOrigin(1, 1),
        scene.add.text(10, 45, '', { ...fontStyle, color: '#ff3312' }).setOrigin(0, 1)
      ])
      .setScale(0.4)
      .setVisible(false)
    this.normalContainer = scene.add
      .container(0, 0, [
        scene.add.sprite(0, 0, assetName.matchTexture, 'smile').setTintFill(color),
        scene.add.graphics({ lineStyle: { width: 4, color: 0 } }).strokeCircle(0, 0, 42)
      ])
      .setVisible(false)
    this.add([this.normalContainer, this.matchingContainer])
    scene.add.existing(this)
  }

  setMatching(matching: boolean, color: PlayerColor, index: number = 0, score: number = 0): Player {
    this.normalContainer.setVisible(!matching)
    this.matchingContainer.setVisible(matching !== this.lastMatch)
    if (matching) {
      const [bg, , playerText, , scoreText] = this.matchingContainer.getAll() as [
        Phaser.GameObjects.Sprite,
        ...Phaser.GameObjects.Text[]
      ]
      bg.setFrame(color === PlayerColor.blue ? '0' : '1')
      playerText.setText((index + 1).toString())
      scoreText.setText(score.toString())
    } else {
      const [smileSprite] = this.normalContainer.getAll() as [Phaser.GameObjects.Sprite]
      smileSprite.setTintFill(color)
    }
    this.scene.tweens.add({
      targets: [this.matchingContainer],
      scale: matching ? 1 : 0.4,
      duration: 200,
      onComplete: () => {
        this.matchingContainer.setVisible(matching)
        this.lastMatch = matching
      }
    })
    return this
  }
}

class UniversitySection extends Phaser.GameObjects.Container {
  universityBoxes: UniversityBox[]
  miniUniversityBoxes: MiniUniversityBox[]

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    const { applications } = Bridge.props.playerState
    this.universityBoxes = CONFIG.universities.map(
      (_, i) =>
        new UniversityBox(
          scene,
          260 + (i % 3) * 240,
          190 + ~~(i / 3) * 220,
          i,
          applications.findIndex(a => a === i)
        )
    )
    this.miniUniversityBoxes = Array(3)
      .fill(null)
      .map((_, i) => new MiniUniversityBox(scene, 130 + i * 250, 0))
    this.add([...this.universityBoxes, ...this.miniUniversityBoxes])
    scene.add.existing(this)
  }

  setMatching(applications: number[], activeApplication: number) {
    this.universityBoxes.forEach((box, i) =>
      box.setInApplication(applications.includes(i)).setIsActive(activeApplication === i)
    )
    this.miniUniversityBoxes.forEach((box, i) =>
      box.setIndex(applications[i]).setIsActive(activeApplication === applications[i])
    )
  }

  apply(universityIndex: number) {
    this.universityBoxes[universityIndex].apply()
  }
}

class MiniUniversityBox extends Phaser.GameObjects.Container {
  bg: Phaser.GameObjects.Graphics
  quotaText: Phaser.GameObjects.Text

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.bg = scene.add.graphics({ lineStyle: { color: 0x0, width: 4 } })
    this.quotaText = scene.add
      .text(120, 30, '', {
        font: '24px Open Sans'
      })
      .setOrigin(0.5, 0.5)
    this.add([this.bg, this.quotaText])
    scene.add.existing(this)
  }

  setIndex(i: number): MiniUniversityBox {
    const { name, quota } = CONFIG.universities[i]
    this.quotaText.setText(`${name}招录: ${quota}`)
    return this
  }

  setIsActive(b: boolean): MiniUniversityBox {
    const BG = {
      width: 240,
      height: 60,
      radius: 12
    }
    this.bg
      .clear()
      .setDefaultStyles({ fillStyle: { color: b ? 0xff3312 : 0x00b6f4 }, lineStyle: { color: 0x0, width: 4 } })
      .fillRoundedRect(0, 0, BG.width, BG.height, BG.radius)
      .strokeRoundedRect(0, 0, BG.width, BG.height, BG.radius)
    return this
  }
}

class UniversityBox extends Phaser.GameObjects.Container {
  bg: Phaser.GameObjects.Rectangle
  nameText: Phaser.GameObjects.Text
  quota: Phaser.GameObjects.Text
  applicationText: Phaser.GameObjects.Text
  applicationBg: Phaser.GameObjects.Rectangle

  constructor(public scene: Phaser.Scene, x: number, y: number, i: number, applicationIndex: number) {
    super(scene, x, y)
    const { name, quota } = CONFIG.universities[i]
    this.bg = scene.add.rectangle(0, 0, 200, 200, 0xffffff)
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
    this.add([this.bg, this.nameText, this.quota, this.applicationBg, this.applicationText])
    scene.add.existing(this)
    scene.add
      .sprite(x, y + 500, assetName.matchTexture, '2')
      .setOrigin(0.5)
      .setDepth(1e3)
  }

  setInApplication(b: boolean): UniversityBox {
    this.quota.setVisible(b)
    return this
  }

  setIsActive(b: boolean): UniversityBox {
    this.bg.setFillStyle(b ? 0xff3312 : 0xffffff)
    this.nameText.setColor(b ? '#fff' : '#1c4ed3')
    this.quota.setColor(b ? '#fff' : '#000')
    this.applicationText.setColor(b ? '#ff3312' : '#fff')
    this.applicationBg.setFillStyle(b ? 0xffffff : 0xff3312)
    return this
  }

  apply() {
    this.scene.tweens.add({
      targets: [this],
      y: { from: this.y, to: this.y - 20 },
      scaleY: { from: 1, to: 0.6 },
      duration: 250,
      yoyo: true
    })
  }
}

class Offer extends Phaser.GameObjects.Container {
  scale = 0
  envelopeMask: Phaser.GameObjects.Graphics
  labelContainer: Phaser.GameObjects.Container

  constructor(public scene: Phaser.Scene, x: number, y: number) {
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
    this.labelContainer = scene.add.container(35, 0, [
      scene.add
        .text(0, 0, '恭喜您被', {
          font: '35px Open Sans',
          fill: '#333'
        })
        .setOrigin(1, 0.5),
      scene.add
        .text(0, 0, '', {
          font: '35px Open Sans',
          fill: '#ff3312'
        })
        .setOrigin(0.5, 0.5),
      scene.add
        .text(0, 0, '录取', {
          font: '35px Open Sans',
          fill: '#333'
        })
        .setOrigin(0, 0.5)
    ])
    this.add([scene.add.sprite(0, 100, assetName.matchTexture, 'offer'), this.labelContainer])
    scene.add.existing(this)
  }

  showUp(label: string) {
    this.envelopeMask.visible = true
    const [textA, textB, textC] = this.labelContainer.getAll() as Phaser.GameObjects.Text[]
    textA.x = -label.length * 19
    textB.text = label
    textC.x = label.length * 19
    this.scene.tweens.add({
      targets: [this],
      scale: { from: 0, to: 1 },
      duration: 100,
      hold: 2e3,
      yoyo: true,
      onComplete: () => (this.envelopeMask.visible = false)
    })
  }
}
