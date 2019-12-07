import { CONFIG, namespace, SceneName } from '../const'
import { Button } from '../component'
import { asset, assetName } from '../asset'
import { BaseScene } from './BaseScene'

export class Result extends BaseScene {
  mainBox: MainBox
  publicAccount: PublicAccount
  btnNext: Button

  constructor() {
    super({ key: SceneName.result })
  }

  preload() {
    this.load.image(assetName.button, asset.button)
    this.load.atlas(assetName.universityTexture, asset.universityTexture, asset.universityAtlas)
    this.load.atlas(assetName.resultTexture, asset.resultTexture, asset.resultAtlas)
  }

  create() {
    this.drawEdge()
    this.btnNext = new Button(
      this,
      320,
      1400,
      () => (window.location.href = `/gametrial/game/${namespace}`),
      '再来一局'
    )
    this.btnNext = new Button(this, 680, 1400, () => alert('TODO'), '分享')
    this.mainBox = new MainBox(this, 125, 250)
    this.publicAccount = new PublicAccount(this, 125, 1000)
  }
}

class MainBox extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number, universityIndex: number = 2) {
    super(scene, x, y)
    const fontStyle = {
      fontSize: '45px',
      fontFamily: 'Open Sans',
      color: '#1c4ed3'
    }
    this.add(scene.add.graphics({ lineStyle: { color: 0x0, width: 6 } }).strokeRoundedRect(50, 0, 650, 700, 30))
    if (universityIndex === -1) {
      this.add([
        scene.add.text(375, 160, '很遗憾，您没有被录取', fontStyle).setOrigin(0.5),
        scene.add.sprite(375, 400, assetName.resultTexture).setOrigin(0.5),
        scene.add.text(375, 600, '再接再励，祝下次成功', { ...fontStyle, fontSize: '36px' }).setOrigin(0.5)
      ])
    } else {
      const { name } = CONFIG.universities[universityIndex],
        x = 420,
        y = 125
      this.add([
        scene.add.text(x - name.length * 24, y, '恭喜您被', fontStyle).setOrigin(1, 0.5),
        scene.add
          .text(x, y, name, {
            ...fontStyle,
            fontStyle: 'bold',
            color: '#ff1122'
          })
          .setOrigin(0.5, 0.5),
        scene.add.text(x + name.length * 24, y, '录取', fontStyle).setOrigin(0, 0.5),
        scene.add
          .sprite(375, 350, assetName.universityTexture, universityIndex)
          .setOrigin(0.5)
          .setDisplaySize(200, 200),
        scene.add.text(100, 500, 'XXX'.repeat(20), {
          ...fontStyle,
          fontSize: '36px',
          wordWrap: { width: 550, useAdvancedWrap: true }
        })
      ])
    }
    scene.add.existing(this)
  }
}

class PublicAccount extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    const border = scene.add.graphics({ lineStyle: { color: 0x0, width: 6 } }).strokeRoundedRect(50, 0, 650, 200, 30)
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
