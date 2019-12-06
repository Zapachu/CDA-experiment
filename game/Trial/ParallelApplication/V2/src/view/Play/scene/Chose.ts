import { Bridge, CONFIG, MoveType, SceneName } from '../const'
import { Button } from '../component'
import { asset, assetName } from '../asset'
import { BaseScene } from './BaseScene'

export class Chose extends BaseScene {
  intro: Intro
  btnClear: Button
  btnNext: Button
  universities: University[]
  applications: number[]

  constructor() {
    super({ key: SceneName.chose })
  }

  preload() {
    this.load.image(assetName.button, asset.button)
    this.load.image(assetName.button2, asset.button2)
    this.load.image(assetName.bootIntroBg, asset.bootIntroBg)
  }

  create() {
    this.drawEdge()
    this.applications = [null, null, null]
    this.intro = new Intro(this, 160, 160)
    this.btnClear = new Button(
      this,
      320,
      1400,
      () => {
        this.applications.fill(null)
        this.universities.forEach(u => u.setSeq(-1))
      },
      '清空',
      assetName.button2
    )
    this.btnNext = new Button(this, 680, 1400, () => {
      console.log(this.applications)
      if (this.applications.includes(null)) {
        return alert('TODO')
      }
      Bridge.emitter.emit(MoveType.toConfirm, { applications: this.applications })
    })
    this.universities = CONFIG.universities.map(
      ({ name }, i) =>
        new University(this, 310 + (i % 2) * 375, 570 + ~~(i / 2) * 130, name, () => {
          const rIndex = this.applications.findIndex(s => s === null || s === i)
          if (rIndex === -1) {
            return -1
          }
          this.applications[rIndex] = i
          return rIndex
        })
    )
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
      scene.add.text(80, 95, '请依次选择你的', fontStyle),
      scene.add.text(40, 155, '第一、第二、第三', { ...fontStyle, color: '#ff1122' }),
      scene.add.text(410, 155, '志愿', fontStyle)
    ])
    scene.add.existing(this)
  }
}

class University extends Phaser.GameObjects.Container {
  clickTint: Phaser.GameObjects.Rectangle
  seqText: Phaser.GameObjects.Container
  readonly width = 340
  readonly height = 96
  readonly radius = 24

  constructor(public scene: Phaser.Scene, x: number, y: number, label: string, onClick: () => number) {
    super(scene, x, y)
    this.mask = this.createGeometryMask(
      scene.make
        .graphics({
          x,
          y
        })
        .fillRoundedRect(-this.width >> 1, -this.height >> 1, this.width, this.height, this.radius)
    )
    this.clickTint = scene.add.rectangle(0, 0, this.width, this.height, 0x91afff, 0.5)
    this.add(this.clickTint.setVisible(false))
    const seqTextLabel = scene.add
      .text(0, 0, '', {
        fontSize: '24px',
        fontFamily: 'Open Sans'
      })
      .setOrigin(0.5)
    this.seqText = scene.add
      .container(135, -15, [scene.add.rectangle(0, 0, 120, 36, 0xff3312), seqTextLabel])
      .setRotation(Math.PI / 3.8)
      .setVisible(false)
    this.add(this.seqText)
    this.add(
      scene.add
        .text(0, 0, label, {
          fontSize: '36px',
          fontFamily: 'Open Sans',
          fontStyle: 'bold',
          color: '#1c4ed3'
        })
        .setOrigin(0.5, 0.5)
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
    this.setInteractive()
    this.on('pointerdown', () => this.clickTint.setVisible(true))
    this.on('pointerup', () => {
      this.clickTint.setVisible(false)
      this.setSeq(onClick())
    })
  }

  setSeq(seq: number) {
    const label = this.seqText.getAt(1) as Phaser.GameObjects.Text
    if (seq === -1) {
      this.seqText.setVisible(false)
    } else {
      this.seqText.setVisible(true)
      label.setText(`NO.${seq + 1}`)
    }
  }
}
