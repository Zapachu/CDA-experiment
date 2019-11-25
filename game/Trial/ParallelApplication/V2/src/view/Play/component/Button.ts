import { assetName } from '../asset'

export class Button extends Phaser.GameObjects.Container {
  constructor(
    public scene: Phaser.Scene,
    x: number,
    y: number,
    onClick: () => void,
    label: string = '下一步',
    texture: string = assetName.button
  ) {
    super(scene, x, y)
    const sprite = scene.add.sprite(0, 0, texture)
    sprite.setInteractive()
    sprite.on('pointerdown', () => sprite.setTint(0xaaaaaa))
    sprite.on('pointerup', () => {
      sprite.clearTint()
      onClick()
    })
    this.add(sprite)
    this.add(
      scene.add
        .text(0, -5, label, {
          fontFamily: 'Open Sans',
          fontSize: '48px'
        })
        .setOrigin(0.5, 0.5)
    )
    scene.add.existing(this)
  }
}
