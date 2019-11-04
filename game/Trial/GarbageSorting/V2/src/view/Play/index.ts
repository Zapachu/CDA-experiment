import {MainGame} from './scene';
import {CONST} from './const';

const config: Phaser.Types.Core.GameConfig = {
    transparent: true,
    parent: CONST.phaserParent,
    scene: [MainGame],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 375,
        height: 667
    },
};

new Phaser.Game(config);
