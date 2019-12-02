import { SceneName } from '../const'
import { Button } from '../component'
import { asset, assetName } from '../asset'

export class Result extends Phaser.Scene {
  intro: Intro
  publicAccount: PublicAccount
  btnNext: Button

  constructor() {
    super({ key: SceneName.result })
  }

  preload() {
    this.load.image(assetName.button, asset.button)
    this.load.atlas(assetName.resultTexture, asset.resultTexture, asset.resultAtlas)
  }

  create() {
    this.add.graphics({ lineStyle: { color: 0x666666, width: 4 } }).strokeRect(125, 145, 750, 1334)
    this.btnNext = new Button(this, 320, 1400, () => this.scene.start(SceneName.chose), '再来一局')
    this.btnNext = new Button(this, 680, 1400, () => this.scene.start(SceneName.chose), '分享')
    // this.intro = new Intro(this, 160, 160)
    this.publicAccount = new PublicAccount(this, 125, 1000)
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
      scene.add.text(70, 100, '考试总分', fontStyle),
      scene.add.text(270, 100, '582', { ...fontStyle, color: '#ff1122' }),
      scene.add.text(70, 155, '开始填报你的志愿吧', fontStyle)
    ])
    scene.add.existing(this)
  }
}

class PublicAccount extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    const border = scene.add.graphics({ lineStyle: { color: 0x0, width: 5 } }).strokeRoundedRect(50, 0, 650, 200)
    const logo = scene.add.sprite(160, 100, assetName.resultTexture, 'logo')
    const publicAccountText = scene.add
      .text(470, 100, '该实验由微课研提供支持长按识别二维码并关注公众号可获知实验原理--实验名称', {
        font: '32px OpenSans',
        fill: '#666',
        wordWrap: { width: 400, useAdvancedWrap: true }
      })
      .setOrigin(0.5, 0.5)
    this.add([border, logo, publicAccountText])
    scene.add.existing(this)
  }
}
