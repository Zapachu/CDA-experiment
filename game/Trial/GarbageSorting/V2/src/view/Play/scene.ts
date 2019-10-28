import {CONST, GarbageTypes, getGarbageConfig, SceneName, TProps} from './const';
import {GarbageType, PushType} from '../../config';
import {asset, assetName} from './asset';

const ENV_CONFIG = {
    x: 189, y: 585, r: 90, w: 18
};

enum AnimName {
    draging1 = 'draging1',
    draging2 = 'draging2',
}

const PlayerDragingFrames: Array<{ key: string, url: string }> = [
    {key: assetName.player01, url: asset.player01},
    {key: assetName.player02, url: asset.player02},
    {key: assetName.player03, url: asset.player03},
    {key: assetName.player04, url: asset.player04},
    {key: assetName.player05, url: asset.player05},
    {key: assetName.player06, url: asset.player06}
];

export class MainGame extends Phaser.Scene {
    props: TProps = CONST.props;
    playerContainer: Phaser.GameObjects.Container;
    lifeStrip: Phaser.GameObjects.Graphics;
    garbageCanCovers: Array<Phaser.GameObjects.Sprite> = [];
    envContainer: Phaser.GameObjects.Container;

    constructor() {
        super({key: SceneName.mainGame});
    }

    get emitter() {
        return this.props.frameEmitter;
    }

    get playerSprite(): Phaser.GameObjects.Sprite {
        return this.playerContainer.getAt(1) as Phaser.GameObjects.Sprite;
    }

    get stageWidth(): number {
        return this.sys.canvas.width;
    }

    get stageHeight(): number {
        return this.sys.canvas.height;
    }

    preload() {
        GarbageTypes.forEach((g) => {
            const {bodyName, bodySrc, coverName, coverSrc} = getGarbageConfig(g);
            this.load.image(bodyName, bodySrc);
            this.load.image(coverName, coverSrc);
        });
        PlayerDragingFrames.map(({key, url}) => this.load.image(key, url));
        this.load.image(assetName.player, asset.player);
        this.load.image(assetName.dump01, asset.dump01);
        this.load.image(assetName.dump02, asset.dump02);
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
        this.drawCans();
        this.setEnv(30);
        this.drawPlayer();
    }

    drawCans() {
        GarbageTypes.forEach((type, i) => {
            const {bodyName, coverName, label} = getGarbageConfig(type),
                bodySprite = this.add.sprite(48 + i * 92, 180, bodyName),
                coverSprite = this.add.sprite(48 + i * 92, 120, coverName);
            this.garbageCanCovers[i] = coverSprite;
            bodySprite.displayWidth = 69;
            bodySprite.displayHeight = 103;
            coverSprite.displayWidth = 83;
            coverSprite.displayHeight = 24;
            this.add.text(44 + i * 92 - label.length * 4, 192, label).setScale(.6);
            bodySprite.setInteractive();
            bodySprite.on('pointerdown', pointer => {
                this.dragPlayer(pointer);
                window.setTimeout(() => this.endDrag(pointer), 4e2);
            });
        });
    }

    showTips(str: string) {
        const {stageWidth} = this;
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
            duration: 3e3,
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
        y = Math.max(230, y);
        y = Math.min(y, 520);
        return {x, y};
    }

    //region drag
    dragPlayer(pointer) {
        const {playerContainer, playerSprite} = this,
            {x, y} = this.formatDragPointer(pointer),
            dY = y - playerContainer.y;
        if (dY !== 0) {
            const animKey = dY < 0 ? AnimName.draging1 : AnimName.draging2;
            if (animKey !== playerSprite.anims.getCurrentKey() || !playerSprite.anims.isPlaying) {
                playerSprite.play(animKey);
            }
        }
        this.tweens.add({
            targets: playerContainer,
            x,
            y,
            duration: Math.abs(dY)
        });
        if (y < 280) {
            const type = GarbageTypes[Math.round((x - 48) / 92)];
            GarbageTypes.forEach(t => {
                t === type ? this.hoverCan(t) : this.leaveCan(t);
            });
        }
    }

    endDrag(pointer) {
        const {playerContainer, playerSprite} = this;
        const {x, y} = this.formatDragPointer(pointer);
        this.tweens.add({
            targets: playerContainer,
            x: 190,
            y: 400,
            duration: 2e2,
            onComplete: () => {
                playerSprite.anims.stop();
                playerSprite.setTexture(assetName.player);
            }
        });
        if (y > 500) {
            GarbageTypes.forEach(t => this.leaveCan(t));
            this.showTips(`懒得分类，丢入垃圾堆`);
        } else if (y < 280) {
            const type = GarbageTypes[Math.round((x - 48) / 92)];
            this.leaveCan(type);
            const {label} = getGarbageConfig(type);
            this.showTips(`丢入垃圾箱: ${label}`);
        }
    }

    //endregion

    drawPlayer() {
        this.anims.create({
            key: AnimName.draging1,
            frames: PlayerDragingFrames as any,
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: AnimName.draging2,
            frames: [
                {key: assetName.player},
                {key: assetName.player01},
                {key: ''}
            ] as any,
            frameRate: 16,
            repeat: -1,
        });
        const container = this.add.container(190, 400),
            shadowSprite = this.add.graphics({
                x: 0,
                y: 75,
                fillStyle: {color: 0x000, alpha: .5}
            }).fillCircle(0, 0, 50).setScale(1, .25),
            playerSprite = this.add.sprite(0, 0, assetName.player);
        container.add(shadowSprite);
        container.add(playerSprite);
        this.playerContainer = container;
        playerSprite.setInteractive({
            draggable: true
        });
        this.tweens.add({
            targets: shadowSprite,
            scaleX: {from: 1, to: .9},
            yoyo: true,
            duration: 5e2,
            repeat: -1
        });
        playerSprite.on('drag', pointer => this.dragPlayer(pointer));
        playerSprite.on('dragend', pointer => this.endDrag(pointer));
        container.add(this.setLife(80));
    }

    hoverCan(type: GarbageType) {
        const coverSprite = this.garbageCanCovers[type];
        if (this.tweens.isTweening(coverSprite)) {
            return;
        }
        this.tweens.add({
            targets: coverSprite,
            y: {from: 120, to: 90},
            duration: 1e2
        });
        this.tweens.add({
            targets: coverSprite,
            rotation: {from: -8e-2, to: 8e-2},
            yoyo: true,
            duration: 2e2,
            delay: 1e2,
            repeat: -1
        });
    }

    leaveCan(type: GarbageType) {
        const coverSprite = this.garbageCanCovers[type];
        this.tweens.getTweensOf(coverSprite).forEach(t => this.tweens.remove(t));
        this.tweens.add({
            targets: coverSprite,
            y: 120,
            duration: 1e2
        });
        this.tweens.add({
            targets: coverSprite,
            rotation: 0,
            duration: 1e2
        });
    }

    setLife(n: number): Phaser.GameObjects.Container {
        const alpha = .8;
        const container = this.add.container(0, 0);
        if (this.lifeStrip) {
            this.lifeStrip.clear();
        } else {
            const bg = this.add.graphics({
                fillStyle: {
                    color: 0x020a1e,
                    alpha
                }
            }).fillRoundedRect(-82.5, -105, 160, 14, 7);
            this.lifeStrip = this.add.graphics({fillStyle: {color: 0x18df42, alpha}});
            container.add(bg);
            container.add(this.lifeStrip);
        }
        this.lifeStrip.fillRoundedRect(-79.5, -102.5, 153.5 * n / CONST.maxLife, 9, 4.5);
        return container;
    }

    setEnv(n: number) {
        const {x, y, r, w} = ENV_CONFIG;
        if (this.envContainer) {
            const strip = this.envContainer.getAt(1) as Phaser.GameObjects.Graphics;
            strip.clear();
        } else {
            const g = this.add.graphics({lineStyle: {width: w, color: 0xd3d3d3}, fillStyle: {color: 0xd3d3d3}});
            g.beginPath();
            g.arc(x, y, r, Phaser.Math.DegToRad(-180), Phaser.Math.DegToRad(0));
            g.strokePath();
            g.closePath();
            g.fillCircle(x - r, y, w >> 1);
            g.fillCircle(x + r, y, w >> 1);
            this.envContainer = this.add.container(0, 0);
            const dumpSprite = this.add.sprite(this.stageWidth >> 1, this.stageHeight, assetName.dump01);
            dumpSprite.setInteractive();
            dumpSprite.on('pointerdown', pointer => {
                this.dragPlayer(pointer);
                window.setTimeout(() => this.endDrag(pointer), 4e2);
            });
            this.envContainer.add(dumpSprite);
            this.envContainer.add(this.add.graphics({
                lineStyle: {width: w, color: 0x5efa2c},
                fillStyle: {color: 0x5efa2c}
            }));
            this.envContainer.add(this.add.text(x - 30, y - 60, n.toString(), {
                fontFamily: 'raster',
                fontSize: '30px',
                color: '#0e9b0e'
            }));
        }
        const {envContainer} = this,
            [dumpSprite, strip, score] = envContainer.getAll() as [Phaser.GameObjects.Sprite, Phaser.GameObjects.Graphics, Phaser.GameObjects.Text];

        const angle = -Math.PI * (1 - n / CONST.maxEnv);
        strip.beginPath();
        strip.arc(x, y, r, -Math.PI, angle);
        strip.strokePath();
        strip.closePath();
        strip.fillCircle(x - r, y, w >> 1);
        strip.fillCircle(x + window.Math.cos(angle) * r, y + window.Math.sin(angle) * r, w >> 1);

        score.setText(n.toString());
        dumpSprite.setTexture([assetName.dump01, assetName.dump02][~~(n / CONST.maxEnv * CONST.envLevel)] || assetName.dump01);
        dumpSprite.setDisplayOrigin(dumpSprite.width >> 1, dumpSprite.height);
    }
}
