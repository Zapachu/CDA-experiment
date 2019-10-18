import {MainGame} from './scene';
import {asset} from './asset';

const config = {
    transparent: true,
    width: 375,
    height: 667,
    scene: [MainGame],
    callbacks: {
        postBoot(game) {
            const style: Partial<CSSStyleDeclaration> = {
                width: '100vw',
                height: '100vh',
                display: 'block',
                background: `url(${asset.background})`,
                objectFit: 'contain'
            };
            Object.assign(game.canvas.style, style);
        }
    }
};

new Phaser.Game(config);
