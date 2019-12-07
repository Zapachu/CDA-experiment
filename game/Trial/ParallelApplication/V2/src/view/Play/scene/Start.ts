import { Bridge, MoveType, SceneName } from '../const'
import { Button } from '../component'
import { asset, assetName } from '../asset'
import { BaseScene } from './BaseScene'

export class Start extends BaseScene {
  intro: Intro
  detail: Detail
  btnNext: Button

  constructor() {
    super({ key: SceneName.start })
  }

  preload() {
    this.load.image(assetName.button, asset.button)
    this.load.image(assetName.bootIntroBg, asset.bootIntroBg)
  }

  create() {
    super.create()
    this.btnNext = new Button(this, 500, 1400, () => Bridge.emitter.emit(MoveType.toChose))
    this.intro = new Intro(this, 160, 160)
    this.detail = new Detail(this, 125, 530)
  }

  update() {
    const {
      playerState: {
        score,
        candidateNumber,
        user: { name = 'XXX' }
      }
    } = Bridge.props
    super.update()
    const totalScore = score.reduce((m, n) => m + n, 0)
    this.intro.setScore(totalScore)
    this.detail.setInfo(name, candidateNumber, totalScore, score)
  }
}

class Intro extends Phaser.GameObjects.Container {
  scoreText: Phaser.GameObjects.Text

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.add(scene.add.sprite(0, 0, assetName.bootIntroBg).setOrigin(0, 0))
    const fontStyle = {
      fontSize: '45px',
      fontFamily: 'Open Sans',
      color: '#1c4ed3'
    }
    this.scoreText = scene.add.text(270, 100, '582', { ...fontStyle, color: '#ff1122' })
    this.add([
      scene.add.text(70, 100, '考试总分', fontStyle),
      this.scoreText,
      scene.add.text(70, 155, '开始填报你的志愿吧', fontStyle)
    ])
    scene.add.existing(this)
  }

  setScore(n: number) {
    this.scoreText.setText(n.toString())
  }
}

class Detail extends Phaser.GameObjects.Container {
  totalScoreText: Phaser.GameObjects.Text
  nameText: Phaser.GameObjects.Text
  candidateNumberText: Phaser.GameObjects.Text
  subjectContainers: Phaser.GameObjects.Container[]

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
    this.subjectContainers = ([
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
    this.totalScoreText = scene.add.text(400, 70, '582', { ...titleStyle, color: '#ff1122' })
    this.nameText = scene.add.text(270, 270, '姓名：研小众', detailStyle)
    this.candidateNumberText = scene.add.text(270, 340, '考号：123456', detailStyle)
    this.add([
      scene.add
        .graphics()
        .lineStyle(5, 0)
        .strokeRoundedRect(40, 0, 670, 770, 40),
      scene.add.text(220, 70, '总分：', titleStyle),
      this.totalScoreText,
      scene.add.line(360, 200, 0, 0, 500, 0, 0x0, 0.2),
      this.nameText,
      this.candidateNumberText,
      ...this.subjectContainers
    ])
    scene.add.existing(this)
  }

  setInfo(name: string, candidateNumber: string, totalScore: number, score: number[]) {
    this.totalScoreText.setText(totalScore.toString())
    this.nameText.setText(`姓名：${name}`)
    this.candidateNumberText.setText(`考号：${candidateNumber}`)
    this.subjectContainers.forEach((c, i) => (c.getAt(0) as Phaser.GameObjects.Text).setText(score[i].toString()))
  }
}
