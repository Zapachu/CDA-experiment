import { scene } from './scene'
import { PHASER_PARENT_ID } from './const'

const config: Phaser.Types.Core.GameConfig = {
  transparent: true,
  parent: PHASER_PARENT_ID,
  scene,
  scale: {
    mode:
      window.innerHeight / window.innerWidth >= 1.624
        ? Phaser.Scale.HEIGHT_CONTROLS_WIDTH
        : Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 1624
  }
}

new Phaser.Game(config)
