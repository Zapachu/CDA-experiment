import { CONST, SceneName } from '../const'
import { asset, assetName } from '../asset'

export class Match extends Phaser.Scene {
  playerSection: PlayerSection
  universitySection: UniversitySection

  constructor() {
    super({ key: SceneName.match })
  }

  preload() {
    this.load.image(assetName.smileFace, asset.smileFace)
    this.load.atlas(assetName.matchTexture, asset.matchTexture, asset.matchAtlas)
  }

  create() {
    this.add.graphics({ lineStyle: { color: 0x666666, width: 4 } }).strokeRect(125, 145, 750, 1334)
    this.playerSection = new PlayerSection(this, 0, 200)
    this.universitySection = new UniversitySection(this, 0, 600)
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
    const sprite = scene.add.sprite(0, 0, assetName.smileFace).setTintFill(color)
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
  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.add(
      CONST.universities.map((name, i) => new UniversityBox(scene, 260 + (i % 3) * 240, 100 + ~~(i / 3) * 220, i))
    )
    scene.add.existing(this)
  }
}

class UniversityBox extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number, i: number) {
    super(scene, x, y)
    const fontStyle = {
      fontSize: '32px',
      fontFamily: 'Open Sans',
      fontStyle: 'bold',
      color: '#1c4ed3',
      wordWrap: { width: 150, useAdvancedWrap: true }
    }
    this.add(scene.add.sprite(0, 0, assetName.matchTexture, '2').setOrigin(0.5))
    this.add(scene.add.text(0, 0, CONST.universities[i], fontStyle).setOrigin(0.5, 0.5))
    scene.add.existing(this)
  }
}
