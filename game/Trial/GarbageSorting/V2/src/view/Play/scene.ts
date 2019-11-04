import {CONST, SceneName} from './const';
import {Garbage, GarbageType, MoveType, PlayerStatus, PushType} from '../../config';
import {asset, assetName} from './asset';

const GarbageCans = [GarbageType.harmful, GarbageType.kitchen, GarbageType.recyclable, GarbageType.other];

function getCanConfig(g: GarbageType): { label: string, bodyFrame: string, coverFrame: string } {
    const [bodyFrame, label] = {
        [GarbageType.harmful]: ['harmful', '有害垃圾'],
        [GarbageType.kitchen]: ['kitchen', '厨余垃圾'],
        [GarbageType.recyclable]: ['recyclable', '可回收垃圾'],
        [GarbageType.other]: ['other', '其它垃圾'],
    }[g];
    return {
        label,
        bodyFrame,
        coverFrame: `${bodyFrame}_c`
    };
}

interface IPointer {
    x: number
    y: number
}

enum AnimName {
    up = 'down',
    down = 'up',
}

type IState = Partial<{
    status: PlayerStatus
    index: number
    env: number
    life: number
    garbageIndex: number
}>

export class MainGame extends Phaser.Scene {
    playerContainer: Phaser.GameObjects.Container;
    lifeStrip: Phaser.GameObjects.Container;
    garbageSprite: Phaser.GameObjects.Sprite;
    garbageText: Phaser.GameObjects.Text;
    canCovers: Array<Phaser.GameObjects.Sprite> = [];
    dumpContainer: Phaser.GameObjects.Container;
    readonly MoveArea = {
        left: 82, right: 298, top: 180, bottom: 520, border: 40
    };
    readonly PlayerInitPosition: IPointer = {
        x: 190, y: 380
    };
    state: IState = {
        status: PlayerStatus.play,
        index: 0,
        env: 0,
        life: 0,
        garbageIndex: 0
    };

    constructor() {
        super({key: SceneName.mainGame});
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

    get yRange() {
        const {MoveArea: {top, bottom, border}} = this;
        return {
            max: bottom - border,
            min: top + border
        };
    }

    preload() {
        this.load.atlas(assetName.canTexture, asset.canTexture, asset.canAtlas);
        this.load.atlas(assetName.playerDownTexture, asset.playerDownTexture, asset.playerDownAtlas);
        this.load.atlas(assetName.playerUpTexture, asset.playerUpTexture, asset.playerUpAtlas);
        this.load.atlas(assetName.garbageTexture, asset.garbageTexture, asset.garbageAtlas);
        this.load.atlas(assetName.dumpTexture, asset.dumpTexture, asset.dumpAtlas);
        this.load.image(assetName.btnSkip, asset.btnSkip);
    }

    create() {
        this.layout();
        CONST.emitter.on(PushType.prepare, ({env, life, garbageIndex, index, status}) => {
                if (index === undefined) {
                    this.add.text(this.stageWidth >> 1, this.stageHeight - 120, '加入游戏失败！', {
                        fontSize: '14px',
                        color: '#da2422'
                    }).setOrigin(.5);
                    this.scene.pause();
                } else {
                    this.updateState({env, life, garbageIndex, index, status});
                }
            }
        );
        CONST.emitter.on(PushType.sync, ({i, t, env, life, garbageIndex, index, status}) => {
            if (!this.sys.game) {
                return;
            }
            if (this.state.index !== index) {
                this.updateState({env});
                t === GarbageType.skip ? this.showTips(`有人将${Garbage[i].label}随手扔入垃圾堆`) : null;
                return;
            }
            if (this.state.garbageIndex !== garbageIndex) {
                window.setTimeout(() => {
                    if (this.state.garbageIndex === garbageIndex) {
                        this.skipGarbage();
                    }
                }, 5e3);
            }
            this.updateState({env, life, garbageIndex, status});
        });
        CONST.emitter.emit(MoveType.prepare);
    }

    updateState(state: IState) {
        if (state.status === PlayerStatus.result) {
            this.sys.game.destroy(true);
            CONST.overCallBack();
            return;
        }
        Object.assign(this.state, state);
        this.updateEnv();
        this.updateLife();
        this.updateGarbage();
    }

    layout() {
        this.drawCans();
        this.drawPlayer();
    }

    drawCans() {
        GarbageCans.forEach((type, i) => {
            const {bodyFrame, coverFrame, label} = getCanConfig(type),
                bodySprite = this.add.sprite(48 + i * 92, 180, assetName.canTexture, bodyFrame),
                coverSprite = this.add.sprite(48 + i * 92, 120, assetName.canTexture, coverFrame);
            this.canCovers[i] = coverSprite;
            bodySprite.displayWidth = 69;
            bodySprite.displayHeight = 103;
            coverSprite.displayWidth = 83;
            coverSprite.displayHeight = 24;
            this.add.text(44 + i * 92 - label.length * 4, 192, label).setScale(.6);
            bodySprite.setInteractive();
            bodySprite.on('pointerdown', pointer => {
                this.dragPlayer(pointer);
                window.setTimeout(() => this.endDrag(pointer), 5e2);
            });
        });
    }

    showTips(str: string) {
        const {stageWidth} = this;
        const y = 250 + ~~(Math.random() * 10) * 25;
        const text = this.add.text(stageWidth, y, str, {fontSize: '16px'});
        const textBg = this.add.graphics({
            x: stageWidth,
            y,
            fillStyle: {color: 0x000, alpha: .6}
        }).fillRoundedRect(-16, -7, text.width + 32, 28, 13).setDepth(-1);
        this.tweens.add({
            targets: [textBg, text],
            x: -stageWidth,
            duration: 8e3,
            onComplete: () => {
                text.destroy();
                textBg.destroy();
            }
        });
    }

    formatDragPointer(pointer: IPointer): IPointer {
        const {MoveArea: {left, right, top, bottom}} = this;
        let x = pointer.x, y = pointer.y;
        x = Math.max(left, x);
        x = Math.min(x, right);
        y = Math.max(top, y);
        y = Math.min(y, bottom);
        return {x, y};
    }

    //region drag
    movePlayer(pointer: IPointer, callback = () => null) {
        const {playerContainer, playerSprite, garbageSprite} = this,
            {x, y} = this.formatDragPointer(pointer),
            dY = y - playerContainer.y,
            dX = x - playerContainer.x;
        if (dY !== 0) {
            const animKey = dY < 0 ? AnimName.up : AnimName.down;
            garbageSprite.setVisible(animKey === AnimName.down);
            if (animKey !== playerSprite.anims.getCurrentKey() || !playerSprite.anims.isPlaying) {
                playerSprite.play(animKey);
            }
        }
        this.tweens.add({
            targets: playerContainer,
            x,
            y,
            duration: Phaser.Geom.Point.GetMagnitude(new Phaser.Geom.Point(dX, dY)),
            onComplete: () => callback()
        });
    }

    dragPlayer(pointer) {
        const {x, y} = this.formatDragPointer(pointer);
        this.movePlayer(pointer, () => {
            if (y > this.yRange.max) {
                const dumpSprite = this.dumpContainer.getAt(0) as Phaser.GameObjects.Sprite;
                dumpSprite.setTint(0x888888);
            } else if (y < this.yRange.min) {
                const type = GarbageCans[Math.round((x - 48) / 92)];
                GarbageCans.forEach(t => {
                    t === type ? this.hoverCan(t) : this.leaveCan(t);
                });
            } else {
                this.resetDragEffect();
            }
        });
    }

    resetDragEffect() {
        const dumpSprite = this.dumpContainer.getAt(0) as Phaser.GameObjects.Sprite;
        dumpSprite.clearTint();
        GarbageCans.forEach(t => this.leaveCan(t));
    }

    endDrag(pointer) {
        const {playerSprite, garbageSprite} = this;
        const {x, y} = this.formatDragPointer(pointer);
        this.movePlayer(this.PlayerInitPosition, () => {
            this.resetDragEffect();
            playerSprite.anims.stop();
            playerSprite.setTexture(assetName.playerDownTexture);
            garbageSprite.setVisible(true);
        });
        if (y > this.yRange.max) {
            this.submit(GarbageType.skip);
        } else if (y < this.yRange.min) {
            const type = GarbageCans[Math.round((x - 48) / 92)];
            this.submit(type);
        }
    }

    submit(t?: GarbageType) {
        CONST.emitter.emit(MoveType.submit, {i: this.state.garbageIndex, t});
    }

    //endregion

    drawPlayer() {
        this.anims.create({
            key: AnimName.up,
            frames: this.anims.generateFrameNames(assetName.playerUpTexture),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: AnimName.down,
            frames: this.anims.generateFrameNames(assetName.playerDownTexture),
            frameRate: 12,
            repeat: -1,
        });
        const container = this.add.container(this.PlayerInitPosition.x, this.PlayerInitPosition.y),
            shadowSprite = this.add.graphics({
                x: 0,
                y: 75,
                fillStyle: {color: 0x000, alpha: .5}
            }).fillCircle(0, 0, 50).setScale(1, .25),
            playerSprite = this.add.sprite(0, 0, assetName.playerDownTexture);
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
        container.add(this.updateLife());
        container.add(this.updateGarbage());
    }

    hoverCan(type: GarbageType) {
        const coverSprite = this.canCovers[type];
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
        const coverSprite = this.canCovers[type];
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

    updateGarbage() {
        const n = this.state.garbageIndex;
        if (this.garbageSprite) {
            this.garbageText.setText((n + 1).toString());
        } else {
            const garbageSprite = this.add.sprite(0, 38, assetName.garbageTexture);
            garbageSprite.displayWidth = 70;
            garbageSprite.displayHeight = 70;
            this.garbageSprite = garbageSprite;
            this.add.text(this.stageWidth >> 1, 25, '/10', {
                fontFamily: 'raster',
                fontSize: '30px',
                color: '#999'
            });
            this.garbageText = this.add.text(this.stageWidth >> 1, 25, n.toString(), {
                fontFamily: 'raster',
                fontSize: '30px',
                color: '#da2422'
            }).setOrigin(1, 0);
        }
        return this.garbageSprite.setRotation(n);
    }

    updateLife(): Phaser.GameObjects.Container {
        const n = this.state.life;
        if (!this.lifeStrip) {
            const alpha = .8;
            const bg = this.add.graphics({fillStyle: {color: 0x020a1e, alpha}})
                .fillRoundedRect(-82.5, -105, 160, 14, 7);
            const lifeStrip = this.add.container(0, 0);
            lifeStrip.add(bg);
            lifeStrip.add(this.add.graphics({fillStyle: {color: 0x18df42, alpha}}));
            this.lifeStrip = lifeStrip;
        }
        const lifeStrip = this.lifeStrip.getAt(1) as Phaser.GameObjects.Graphics;
        lifeStrip.clear();
        if (n) {
            lifeStrip.fillRoundedRect(-79.5, -102.5, 153.5 * n / CONST.maxLife, 9, 4.5);
        }
        return this.lifeStrip;
    }

    skipGarbage(pointer: IPointer = {x: 190, y: 620}) {
        this.dragPlayer(pointer);
        window.setTimeout(() => this.endDrag(pointer), 5e2);
    }

    updateEnv() {
        const n = this.state.env;
        const x = 0, y = -80, r = 90, w = 18;
        if (!this.dumpContainer) {
            const dumpSprite = this.add.sprite(0, 0, assetName.dumpTexture);
            const bg = this.add.graphics({
                lineStyle: {width: w, color: 0xd3d3d3},
                fillStyle: {color: 0xd3d3d3}
            });
            bg.beginPath();
            bg.arc(x, y, r, Phaser.Math.DegToRad(-180), Phaser.Math.DegToRad(0));
            bg.strokePath();
            bg.slice(x - r, y, w >> 1, 0, Math.PI);
            bg.fillPath();
            bg.slice(x + r, y, w >> 1, 0, Math.PI);
            bg.fillPath();
            bg.closePath();
            const stripGraphics = this.add.graphics({lineStyle: {width: w}});
            const scoreText = this.add.text(x, y - 45, n.toString(), {
                fontFamily: 'raster',
                fontSize: '30px'
            }).setStroke('#fff', 6).setOrigin(.5);
            const scoreLabel = this.add.text(x, y - 5, '环境评分', {fontSize: '18px'}).setStroke('#fff', 6).setOrigin(.5);
            const btnSkip = this.add.image(0, 0, assetName.btnSkip),
                btnSkipLabel = this.add.text(0, 0, '懒得分类', {
                    fontSize: '14px',
                    color: '#ffffff',
                }).setOrigin(.5, .5).setAlpha(.9);
            btnSkip.setInteractive();
            btnSkip.on('pointerdown', pointer => {
                this.skipGarbage(pointer);
                btnSkip.setTint(0x888888);
                window.setTimeout(() => {
                    btnSkip.clearTint();
                }, 5e2);
            });
            const btnContainer = this.add.container(x, y + 40, [btnSkip, btnSkipLabel]);
            this.dumpContainer = this.add.container(this.stageWidth >> 1, this.stageHeight, [dumpSprite, bg, stripGraphics, scoreText, scoreLabel, btnContainer]);
        }
        const {dumpContainer} = this,
            [dumpSprite, , stripGraphics, scoreText, scoreLabel] = dumpContainer.getAll() as [Phaser.GameObjects.Sprite, Phaser.GameObjects.Graphics, Phaser.GameObjects.Graphics, Phaser.GameObjects.Text, Phaser.GameObjects.Text, Phaser.GameObjects.Container];
        dumpSprite.setFrame(~~((CONST.maxEnv - n) / CONST.envStep));
        dumpSprite.setDisplayOrigin(dumpSprite.width >> 1, dumpSprite.height);
        const angle = -Math.PI * (1 - n / CONST.maxEnv);
        const color = Phaser.Display.Color.HSLToColor(.12 * n / 360, .8, .43).color,
            hexColor = '#' + Phaser.Display.Color.ComponentToHex(color);
        stripGraphics.setDefaultStyles({
            lineStyle: {width: w, color},
            fillStyle: {color}
        });
        stripGraphics.clear().beginPath();
        stripGraphics.beginPath();
        stripGraphics.arc(x, y, r, -Math.PI, angle);
        stripGraphics.strokePath();
        stripGraphics.closePath();
        if (n) {
            stripGraphics.slice(x - r, y, w >> 1, 0, Math.PI);
            stripGraphics.fillPath();
            stripGraphics.slice(x + window.Math.cos(angle) * r, y + window.Math.sin(angle) * r, w >> 1, angle, Math.PI + angle);
            stripGraphics.fillPath();
        }
        scoreText.setColor(hexColor).setText(n.toString());
        scoreLabel.setColor(hexColor);
    }
}
