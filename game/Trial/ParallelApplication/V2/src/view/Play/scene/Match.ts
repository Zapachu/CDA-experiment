import { SceneName } from '../const'
import { asset, assetName } from '../asset'

export class Match extends Phaser.Scene {
  constructor() {
    super({ key: SceneName.match })
  }

  preload() {
    this.load.image(assetName.button, asset.button)
    this.load.image(assetName.bootIntroBg, asset.bootIntroBg)
  }

  create() {
    this.add.graphics({ lineStyle: { color: 0x666666, width: 4 } }).strokeRect(125, 145, 750, 1334)
  }
}
