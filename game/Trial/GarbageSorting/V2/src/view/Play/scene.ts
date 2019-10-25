import {CONST, GarbageTypes, getGarbageConfig, SceneName, TProps} from './const';
import {PushType} from '../../config';
import {asset, assetName} from './asset';

export class MainGame extends Phaser.Scene {
    props: TProps = CONST.props;
    lifeStrip: Phaser.GameObjects.Graphics;
    envGroup: {
        strip: Phaser.GameObjects.Graphics;
        score: any
    };
    envConfig = {
        x: 189, y: 585, r: 90, w: 18
    };

    constructor() {
        super({key: SceneName.mainGame});
    }

    get emitter() {
        return this.props.frameEmitter;
    }

    preload() {
        GarbageTypes.forEach((g) => {
            const {bodyName, bodySrc, coverName, coverSrc} = getGarbageConfig(g);
            this.load.image(bodyName, bodySrc);
            this.load.image(coverName, coverSrc);
        });
        this.load.image(assetName.player, asset.player);
        this.load.image(assetName.dump01, asset.dump01);
    }

    create() {
        this.layout();
        this.emitter.on(PushType.sort, ({token, t}) => {
            if (token !== this.props.playerState.actor.token) {
                return;
            }
        });
    }

    layout() {
        const stageWidth = this.sys.canvas.width;
        this.add.text(stageWidth - 80 >> 1, 25, '1/10', {
            fontFamily: 'raster',
            fontSize: '30px',
            color: '#999'
        });
        GarbageTypes.forEach((g, i) => {
            const {bodyName, coverName, label} = getGarbageConfig(g);
            const body = this.add.sprite(48 + i * 92, 180, bodyName),
                cover = this.add.sprite(48 + i * 92, 120, coverName);
            body.displayWidth = 69;
            body.displayHeight = 103;
            cover.displayWidth = 83;
            cover.displayHeight = 24;
            this.add.text(44 + i * 92 - label.length * 4, 192, label).setScale(.6);
        });
        this.setEnv(40);
        this.drawPlayer();
    }

    showTips(str: string) {
        const stageWidth = this.sys.canvas.width;
        const y = 250 + ~~(Math.random() * 10) * 25;
        const text = this.add.text(stageWidth, y, str, {
            fontSize: '20px'
        });
        const textBg = this.add.graphics({
            x: stageWidth,
            y,
            fillStyle: {color: 0x000, alpha: .6}
        }).fillRoundedRect(-16, -4, text.width + 32, 26, 13).setDepth(-1);
        this.tweens.add({
            targets: [textBg, text],
            x: -stageWidth,
            duration: 5e3,
            onComplete: () => {
                text.destroy();
                textBg.destroy();
            }
        });
    }

    formatDragPointer(pointer): { x: number, y: number } {
        let x = pointer.x, y = pointer.y;
        x = Math.max(82, x);
        x = Math.min(x, 298);
        y = Math.max(106, y);
        y = Math.min(y, 575);
        return {x, y};
    }

    drawPlayer() {
        const container = this.add.container(0, 0);
        const player = this.add.sprite(190, 400, assetName.player),
            shadow = this.add.graphics({
                x: 190,
                y: 475,
                fillStyle: {color: 0x000, alpha: .5}
            }).fillCircle(0, 0, 50).setScale(1, .25);
        container.add(shadow);
        container.add(player);
        player.setInteractive({
            draggable: true
        });
        this.tweens.add({
            targets: shadow,
            scaleX: {from: 1, to: .9},
            yoyo: true,
            duration: 5e2,
            repeat: -1
        });
        player.on('drag', (pointer) => {
            const {x, y} = this.formatDragPointer(pointer);
            container.x = x - player.x;
            container.y = y - player.y;
        });
        player.on('dragend', (pointer1) => {
            const {x, y} = this.formatDragPointer(pointer1);
            container.x = 0;
            container.y = 0;
            if (y > 500) {
                this.showTips(`懒得分类，丢入垃圾堆`);
            } else if (y < 240) {
                const type = GarbageTypes[Math.round((x - 48) / 95)];
                const {label} = getGarbageConfig(type);
                this.showTips(`丢入垃圾箱: ${label}`);
            }
        });
        container.add(this.setLife(80));
    }

    setLife(n: number): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0);
        if (this.lifeStrip) {
            this.lifeStrip.clear();
        } else {
            const bg = this.add.graphics({
                fillStyle: {
                    color: 0x020a1e,
                    alpha: 1
                }
            }).fillRoundedRect(107.5, 295, 160, 14, 7);
            this.lifeStrip = this.add.graphics({fillStyle: {color: 0x18df42, alpha: 1}});
            container.add(bg);
            container.add(this.lifeStrip);
        }
        this.lifeStrip.fillRoundedRect(110.5, 297.5, 153.5 * n / CONST.maxLife, 9, 4.5);
        return container;
    }

    setEnv(n: number) {
        const {envConfig: {x, y, r, w}} = this;
        if (this.envGroup) {
            this.envGroup.strip.clear();
        } else {
            const g = this.add.graphics({lineStyle: {width: w, color: 0xd3d3d3}, fillStyle: {color: 0xd3d3d3}});
            g.beginPath();
            g.arc(x, y, r, Phaser.Math.DegToRad(-180), Phaser.Math.DegToRad(0));
            g.strokePath();
            g.closePath();
            g.fillCircle(x - r, y, w >> 1);
            g.fillCircle(x + r, y, w >> 1);
            this.envGroup = {
                strip: this.add.graphics({lineStyle: {width: w, color: 0x5efa2c}, fillStyle: {color: 0x5efa2c}}),
                score: this.add.text(x - 30, y - 60, n.toString(), {
                    fontFamily: 'raster',
                    fontSize: '30px',
                    color: '#0e9b0e'
                })
            };
        }
        const {envGroup: {strip}} = this;
        const angle = -Math.PI * (1 - n / CONST.maxEnv);
        strip.clear().beginPath();
        strip.arc(x, y, r, -Math.PI, angle);
        strip.strokePath();
        strip.closePath();
        strip.fillCircle(x - r, y, w >> 1);
        strip.fillCircle(x + window.Math.cos(angle) * r, y + window.Math.sin(angle) * r, w >> 1);

        this.drawDump();
    }

    drawDump() {
        this.add.sprite(0, 563, assetName.dump01).setOrigin(0, 0).setDepth(-1);
    }
}
