import { SceneName } from './const'

type IState = Partial<{}>

export class MainGame extends Phaser.Scene {
  state: IState = {}

  constructor() {
    super({ key: SceneName.mainGame })
  }

  preload() {}

  create() {
    this.add.rectangle(125, 145, 750, 1334, 0x000000, 0.1).setOrigin(0, 0)
  }
}
