import { CONST, span } from './const'
import { MainGame } from './scene'

const config = {
  backgroundColor: CONST.backgroundColor,
  width: span(CONST.col),
  height: span(CONST.row + CONST.col),
  scene: [MainGame],
  callbacks: {
    postBoot(game) {
      const style: Partial<CSSStyleDeclaration> = {
        width: '100vw',
        height: '100vh',
        display: 'block',
        background: CONST.backgroundColor,
        objectFit: 'contain'
      }
      Object.assign(game.canvas.style, style)
    }
  }
}

exports = new Phaser.Game(config)
