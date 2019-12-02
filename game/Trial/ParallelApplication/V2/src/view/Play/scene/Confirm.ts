import { CONST, SceneName, Util } from '../const'
import { Button } from '../component'
import { asset, assetName } from '../asset'

export class Confirm extends Phaser.Scene {
  intro: Intro
  applications: Application[]
  btnClear: Button
  btnNext: Button
  selection: number[]

  constructor() {
    super({ key: SceneName.confirm })
  }

  init(data) {
    this.selection = data
  }

  preload() {
    this.load.image(assetName.button, asset.button)
    this.load.image(assetName.button2, asset.button2)
    this.load.image(assetName.bootIntroBg, asset.bootIntroBg)
    this.load.atlas(assetName.universityTexture, asset.universityTexture, asset.universityAtlas)
  }

  create() {
    this.add.graphics({ lineStyle: { color: 0x666666, width: 4 } }).strokeRect(125, 145, 750, 1334)
    this.intro = new Intro(this, 160, 160)
    this.applications = this.selection.map((j, i) => new Application(this, 500, 670 + i * 170, i, j))
    this.btnClear = new Button(this, 320, 1400, () => this.scene.start(SceneName.chose), '重新选择', assetName.button2)
    this.btnNext = new Button(this, 680, 1400, () => this.scene.start(SceneName.match), '提交并投档')
  }
}

class Intro extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.add(scene.add.sprite(0, 0, assetName.bootIntroBg).setOrigin(0, 0))
    const fontStyle = {
      fontSize: '45px',
      fontFamily: 'Open Sans',
      color: '#1c4ed3'
    }
    this.add([
      scene.add.text(70, 100, '请确定你选择的志愿', fontStyle),
      scene.add.text(70, 155, '并开始填报', fontStyle)
    ])
    scene.add.existing(this)
  }
}

class Application extends Phaser.GameObjects.Container {
  cornerText: Phaser.GameObjects.Container
  readonly width = 700
  readonly height = 135
  readonly radius = 12

  constructor(public scene: Phaser.Scene, x: number, y: number, applicationIndex: number, universityIndex: number) {
    super(scene, x, y)
    this.mask = this.createGeometryMask(
      scene.make
        .graphics({
          x,
          y
        })
        .fillRoundedRect(-this.width >> 1, -this.height >> 1, this.width, this.height, this.radius)
    )
    const cornerTextLabel = scene.add
      .text(0, 12, `NO.${applicationIndex + 1}`, {
        fontSize: '32px',
        fontFamily: 'Open Sans'
      })
      .setOrigin(0.5)
    this.cornerText = scene.add
      .container(320, -35, [scene.add.rectangle(0, 0, 150, 70, 0xff3312), cornerTextLabel])
      .setRotation(Math.PI / 3.8)
    this.add(this.cornerText)
    this.add(scene.add.sprite(-280, 0, assetName.universityTexture, universityIndex).setDisplaySize(96, 96))
    this.add(
      scene.add.text(-215, -25, CONST.universities[universityIndex].name, {
        fontSize: '40px',
        fontFamily: 'Open Sans',
        color: '#000'
      })
    )
    this.add(
      scene.add.text(110, -25, `第${Util.index2ChineseNumber(applicationIndex)}志愿`, {
        fontSize: '40px',
        fontFamily: 'Open Sans',
        color: '#1c4ed3'
      })
    )
    this.add(
      scene.add
        .graphics({
          lineStyle: {
            color: 0x333333,
            width: 10
          }
        })
        .strokeRoundedRect(-this.width >> 1, -this.height >> 1, this.width, this.height, this.radius)
    )
    scene.add.existing(this)
  }
}
