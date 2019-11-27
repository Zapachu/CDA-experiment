import { SceneName } from '../const'
import { Button } from '../component'
import { asset, assetName } from '../asset'

export class Boot extends Phaser.Scene {
  intro: Intro
  detail: Detail
  btnNext: Button

  constructor() {
    super({ key: SceneName.boot })
  }

  preload() {
    this.load.image(assetName.button, asset.button)
    this.load.image(assetName.bootIntroBg, asset.bootIntroBg)
  }

  create() {
    this.add.graphics({ lineStyle: { color: 0x666666, width: 4 } }).strokeRect(125, 145, 750, 1334)
    this.btnNext = new Button(this, 500, 1400, () => this.scene.start(SceneName.chose))
    this.intro = new Intro(this, 160, 160)
    this.detail = new Detail(this, 125, 530)
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

class Detail extends Phaser.GameObjects.Container {
  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    const titleStyle = {
        fontFamily: 'Open Sans',
        color: '#000000',
        fontSize: '64px',
        fontStyle: 'bold'
      },
      detailStyle = {
        fontSize: '32px',
        fontFamily: 'Open Sans',
        color: '#1c4ed3'
      }
    const subjects = ([
      ['语文', '123'],
      ['数学', '123'],
      ['英语', '123'],
      ['综合', '123']
    ] as Array<[string, string]>).map(([subject, score], i) =>
      scene.add.container(130, 500, [
        scene.add
          .text(160 * i, 0, score, {
            ...detailStyle,
            color: '#ff1122',
            fontSize: '56px',
            fontStyle: 'bold'
          })
          .setOrigin(0.5),
        scene.add.text(160 * i, 80, subject, detailStyle).setOrigin(0.5)
      ])
    )
    this.add([
      scene.add
        .graphics()
        .lineStyle(5, 0)
        .strokeRoundedRect(40, 0, 670, 770, 40),
      scene.add.text(220, 70, '总分：', titleStyle),
      scene.add.text(400, 70, '582', { ...titleStyle, color: '#ff1122' }),
      scene.add.line(360, 200, 0, 0, 500, 0, 0x0, 0.2),
      scene.add.text(270, 270, '姓名：研小众', detailStyle),
      scene.add.text(270, 340, '考号：123456', detailStyle),
      ...subjects
    ])
    scene.add.existing(this)
  }
}
