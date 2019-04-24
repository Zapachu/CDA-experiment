import {MainMenuScene} from './scenes/mainMenuScene'
import {GameScene} from './scenes/gameScene'

const config: GameConfig = {
    width: 256,
    height: 256,
    scene: [MainMenuScene, GameScene],
    input: {
        keyboard: true,
        mouse: false,
        touch: false,
        gamepad: false
    },
    callbacks: {
        postBoot(game) {
            const style: Partial<CSSStyleDeclaration> = {
                width: '100vw',
                height: '100vh',
                objectFit: 'contain'
            }
            Object.assign(game.canvas.style, style)
        }
    }
}

exports = new Phaser.Game(config)
