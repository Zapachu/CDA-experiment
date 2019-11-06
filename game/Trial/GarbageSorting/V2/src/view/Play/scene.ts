import {CONST, SceneName} from './const';
import {GarbageConfig, GarbageType, MoveType, PlayerStatus, PushType} from '../../config';
import {asset, assetName} from './asset';

interface IPointer {
    x: number
    y: number
}

type IState = Partial<{
    status: PlayerStatus
    index: number
    env: number
    life: number
    garbageIndex: number
}>

export class MainGame extends Phaser.Scene {
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

    static resetHover() {
        Env.instance.setHover(false);
        Can.setHover();
    }

    preload() {
        this.load.atlas(assetName.canTexture, asset.canTexture, asset.canAtlas);
        this.load.atlas(assetName.playerDownTexture, asset.playerDownTexture, asset.playerDownAtlas);
        this.load.atlas(assetName.playerUpTexture, asset.playerUpTexture, asset.playerUpAtlas);
        this.load.atlas(assetName.garbageTexture, asset.garbageTexture, asset.garbageAtlas);
        this.load.atlas(assetName.dumpTexture, asset.dumpTexture, asset.dumpAtlas);
        this.load.image(assetName.particle, asset.particle);
        this.load.image(assetName.btnSkip, asset.btnSkip);
    }

    create() {
        const {MoveArea} = Player;
        Can.init(this, pointer => {
            Player.instance.dragPlayer(pointer);
            window.setTimeout(() => Player.instance.endDrag(pointer), 5e2);
        });
        Player.init(this,
            ({x, y}: IPointer) => {
                if (y > MoveArea.bottomTrigger) {
                    Env.instance.setHover(true);
                } else if (y < MoveArea.topTrigger) {
                    const type = Can.x2type(x);
                    Can.setHover(type);
                } else {
                    MainGame.resetHover();
                }
            },
            ({x, y}: IPointer) => {
                MainGame.resetHover();
                if (y > MoveArea.bottomTrigger) {
                    this.submit(GarbageType.skip);
                } else if (y < MoveArea.topTrigger) {
                    this.submit(Can.x2type(x));
                }
            },
            this.state.life, this.state.garbageIndex);
        BtnSkip.init(this, (pointer: IPointer = {x: 380, y: 1040}) => {
            Player.instance.dragPlayer(pointer);
            window.setTimeout(() => Player.instance.endDrag(pointer), 5e2);
        });
        CONST.emitter.on(PushType.sync, ({i, t, env, life, garbageIndex, index, status}) => {
            if (!this.sys.game || this.scene.isPaused()) {
                return;
            }
            if (this.state.index !== index) {
                this.setState({env});
                t === GarbageType.skip ? Tips.show(this, `有人将${GarbageConfig[i].label}随手扔入垃圾堆`) : null;
                return;
            }
            this.setState({env, life, garbageIndex, status});
        });
        CONST.emitter.emit(MoveType.prepare, {}, ({env, life, garbageIndex, index, status}) => {
            if (index === undefined) {
                this.add.text(this.sys.canvas.width >> 1, this.sys.canvas.height - 240, '加入游戏失败！', {
                    fontSize: '28px',
                    color: '#da2422'
                }).setOrigin(.5);
                this.scene.pause();
            } else {
                this.setState({env, life, garbageIndex, index, status});
            }
        });
    }

    setState(state: IState) {
        if (state.status === PlayerStatus.result) {
            this.sys.game.destroy(true);
            CONST.overCallBack();
            return;
        }
        Object.assign(this.state, state);
        state.env !== undefined ? Env.setEnv(this, this.state.env) : null;
        state.life !== undefined ? LifeStrip.setLife(this, this.state.life) : null;
        if (state.garbageIndex !== undefined) {
            Garbage.setGarbage(this, this.state.garbageIndex);
            BtnSkip.instance.playBurning();
        }
    }

    submit(t: GarbageType) {
        BtnSkip.instance.stopBurning();
        CONST.emitter.emit(MoveType.submit, {i: this.state.garbageIndex, t});
    }

    update(time: number, delta: number): void {
        BtnSkip.update();
    }
}

class BtnSkip {
    static instance: BtnSkip;
    container: Phaser.GameObjects.Container;
    burningStartTime: number = -1;
    stopTimer: number;

    private constructor(private scene: Phaser.Scene, private onClick: (pointer?: IPointer) => void) {
        const {width: stageWidth, height: stageHeight} = scene.sys.canvas;
        const btnSkip = scene.add.image(0, 0, assetName.btnSkip);
        btnSkip.setInteractive();
        btnSkip.on('pointerdown', pointer => {
            onClick(pointer);
            btnSkip.setTint(0x888888);
            window.setTimeout(() => {
                btnSkip.clearTint();
            }, 5e2);
        });

        const particles = scene.add.particles(assetName.particle);
        particles.createEmitter({
            x: btnSkip.width >> 1,
            speed: {min: 160, max: 200},
            gravityY: 360,
            scale: {start: 2, end: 0},
            lifespan: 2000,
            quantity: 1.5
        });
        const mask = scene.make.graphics({
            x: stageWidth - btnSkip.width >> 1,
            y: stageHeight - 80 - btnSkip.height / 2
        }).fillRect(0, 0, 306, 68);
        btnSkip.mask = new Phaser.Display.Masks.GeometryMask(scene, mask);
        const btnSkipLabel = scene.add.text(0, 0, '懒得分类', {
            fontSize: '28px',
            color: '#ffffff',
        }).setOrigin(.5, .5).setAlpha(.9);
        btnSkipLabel.mask = btnSkip.mask;
        this.container = scene.add.container(stageWidth >> 1, stageHeight - 80, [btnSkip, btnSkipLabel, particles, mask]).setDepth(100);
    }

    static init(scene: Phaser.Scene, onClick: (pointer: IPointer) => void) {
        if (this.instance) {
            return;
        }
        this.instance = new BtnSkip(scene, onClick);
    }

    static update() {
        const [btnSkip, , particles, mask] = this.instance.container.getAll() as [Phaser.GameObjects.Sprite, Phaser.GameObjects.Sprite, Phaser.GameObjects.Particles.ParticleEmitterManager, Phaser.GameObjects.Graphics];
        if (this.instance.burningStartTime >= 0) {
            mask.clear().fillRoundedRect(0, 0, btnSkip.width + particles.x, btnSkip.height, {
                tl: 0, bl: 0, tr: btnSkip.height >> 1, br: btnSkip.height >> 1
            });
        }
    }

    playBurning() {
        const duration = CONST.sortSeconds * 1000;
        const [btnSkip, , particles] = this.container.getAll() as [Phaser.GameObjects.Sprite, Phaser.GameObjects.Sprite, Phaser.GameObjects.Particles.ParticleEmitterManager, Phaser.GameObjects.Graphics];
        this.burningStartTime = this.scene.time.now;
        this.scene.tweens.add({
            targets: [particles],
            x: {from: 0, to: -btnSkip.width},
            duration
        });
        this.stopTimer = window.setTimeout(() => {
            this.burningStartTime = -1;
            this.onClick();
        }, duration);
    }

    stopBurning() {
        this.burningStartTime = -1;
        window.clearTimeout(this.stopTimer);
    }
}

enum PlayerAnimation {
    up = 'down',
    down = 'up',
}

class Player {
    static readonly MoveArea = {
        left: 164, right: 596, top: 360, bottom: 1040, bottomTrigger: 960, topTrigger: 440
    };
    static readonly InitPosition: IPointer = {x: 380, y: 760};
    static instance: Player;
    container: Phaser.GameObjects.Container;

    private constructor(private scene: Phaser.Scene, private onDrag: (pointer: IPointer) => void, private onDragEnd: (pointer: IPointer) => void, life: number, garbageIndex: number) {
        scene.anims.create({
            key: PlayerAnimation.up,
            frames: scene.anims.generateFrameNames(assetName.playerUpTexture),
            frameRate: 15,
            repeat: -1,
        });
        scene.anims.create({
            key: PlayerAnimation.down,
            frames: scene.anims.generateFrameNames(assetName.playerDownTexture),
            frameRate: 18,
            repeat: -1,
        });
        const container = scene.add.container(Player.InitPosition.x, Player.InitPosition.y),
            shadowSprite = scene.add.graphics({
                x: 0,
                y: 150,
                fillStyle: {color: 0x000, alpha: .5}
            }).fillCircle(0, 0, 100).setScale(1, .25),
            playerSprite = scene.add.sprite(0, 0, assetName.playerDownTexture);
        container.add(shadowSprite);
        container.add(playerSprite);
        playerSprite.setInteractive({
            draggable: true
        });
        scene.tweens.add({
            targets: shadowSprite,
            scaleX: {from: 1, to: .9},
            yoyo: true,
            duration: 5e2,
            repeat: -1
        });
        playerSprite.on('drag', pointer => this.dragPlayer(pointer));
        playerSprite.on('dragend', pointer => this.endDrag(pointer));
        container.add(LifeStrip.setLife(scene, life));
        container.add(Garbage.setGarbage(scene, garbageIndex));
        this.container = container;
    }

    get playerSprite(): Phaser.GameObjects.Sprite {
        return this.container.getAt(1) as Phaser.GameObjects.Sprite;
    }

    get garbageSprite(): Phaser.GameObjects.Sprite {
        return this.container.getAt(3) as Phaser.GameObjects.Sprite;
    }

    static formatDragPointer(pointer: IPointer): IPointer {
        const {left, right, top, bottom} = this.MoveArea;
        let x = pointer.x, y = pointer.y;
        x = Math.max(left, x);
        x = Math.min(x, right);
        y = Math.max(top, y);
        y = Math.min(y, bottom);
        return {x, y};
    }

    static init(scene: Phaser.Scene, onDrag: (pointer: IPointer) => void, onDragEnd: (pointer: IPointer) => void, life: number, garbageIndex: number) {
        if (this.instance) {
            return;
        }
        this.instance = new Player(scene, onDrag, onDragEnd, life, garbageIndex);
    }

    dragPlayer(pointer) {
        this.movePlayer(pointer, () => this.onDrag(pointer));
    }

    endDrag(pointer) {
        const {playerSprite, garbageSprite} = this;
        this.onDragEnd(pointer);
        this.movePlayer(Player.InitPosition, () => {
            playerSprite.anims.stop();
            playerSprite.setTexture(assetName.playerDownTexture);
            garbageSprite.setVisible(true);
        });
    }

    movePlayer(pointer: IPointer, callback = () => null) {
        const {container, playerSprite, garbageSprite} = this,
            {x, y} = Player.formatDragPointer(pointer),
            dY = y - container.y,
            dX = x - container.x;
        if (dY !== 0) {
            const animKey = dY < 0 ? PlayerAnimation.up : PlayerAnimation.down;
            garbageSprite.setVisible(animKey === PlayerAnimation.down);
            if (animKey !== playerSprite.anims.getCurrentKey() || !playerSprite.anims.isPlaying) {
                playerSprite.play(animKey);
            }
        }
        this.scene.tweens.add({
            targets: container,
            x,
            y,
            duration: Phaser.Geom.Point.GetMagnitude(new Phaser.Geom.Point(dX, dY))>>1,
            onComplete: () => callback()
        });
    }
}

class Can {
    static readonly cfg = {
        baseX: 96,
        baseY: 240,
        xStep: 184,
        cans: [GarbageType.harmful, GarbageType.kitchen, GarbageType.recyclable, GarbageType.other]
    };
    static instances: { [key: number]: Can } = {};
    container: Phaser.GameObjects.Container;

    private constructor(public type: GarbageType, private scene: Phaser.Scene, onClick: (pointer: IPointer) => void) {
        const {bodyFrame, coverFrame, label} = Can.getCanConfig(this.type),
            bodySprite = scene.add.sprite(0, 120, assetName.canTexture, bodyFrame),
            coverSprite = scene.add.sprite(0, 0, assetName.canTexture, coverFrame),
            nameText = scene.add.text(-16 - label.length * 4, 144, label);
        bodySprite.setInteractive();
        bodySprite.on('pointerdown', pointer => onClick(pointer));
        this.container = scene.add.container(Can.cfg.baseX + this.type * Can.cfg.xStep, Can.cfg.baseY, [bodySprite, coverSprite, nameText]);
    }

    static init(scene: Phaser.Scene, onClick: (pointer: IPointer) => void) {
        Can.cfg.cans.forEach(type => Can.instances[type] = new Can(type, scene, onClick));
    }

    static get(type: GarbageType) {
        return Can.instances[type];
    }

    static x2type(x: number): GarbageType {
        const {cans, baseX, xStep} = Can.cfg;
        return cans[Math.round((x - baseX) / xStep)];
    }

    static setHover(type?: GarbageType) {
        this.cfg.cans.forEach(t => this.get(t).setHover(t === type));
    }

    private static getCanConfig(g: GarbageType): { label: string, bodyFrame: string, coverFrame: string } {
        const [bodyFrame, label] = {
            [GarbageType.harmful]: ['harmful', '有害垃圾'],
            [GarbageType.kitchen]: ['kitchen', '厨余垃圾'],
            [GarbageType.recyclable]: ['recyclable', '可回收垃圾'],
            [GarbageType.other]: ['other', '其它垃圾'],
        }[g];
        return {label, bodyFrame, coverFrame: `${bodyFrame}_c`};
    }

    setHover(hover: boolean) {
        const {scene: {tweens}, container} = this;
        const coverSprite = container.getAt(1);
        if (hover) {
            if (tweens.isTweening(coverSprite)) {
                return;
            }
            tweens.add({
                targets: coverSprite,
                y: -60,
                duration: 1e2
            });
            tweens.add({
                targets: coverSprite,
                rotation: {from: -8e-2, to: 8e-2},
                yoyo: true,
                duration: 2e2,
                delay: 1e2,
                repeat: -1
            });
        } else {
            tweens.getTweensOf(coverSprite).forEach(t => tweens.remove(t));
            tweens.add({
                targets: coverSprite,
                y: 0,
                duration: 1e2
            });
            tweens.add({
                targets: coverSprite,
                rotation: 0,
                duration: 1e2
            });
        }
    }
}

class Env {
    static instance: Env;
    static readonly cfg = {
        x: 0,
        y: -160,
        r: 180,
        w: 36
    };
    container: Phaser.GameObjects.Container;

    private constructor(private scene: Phaser.Scene, private n: number = 0) {
        const {x, y, r, w} = Env.cfg;
        const dumpSprite = scene.add.sprite(0, 0, assetName.dumpTexture);
        const bg = scene.add.graphics({
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
        const stripGraphics = scene.add.graphics({lineStyle: {width: w}});
        const scoreText = scene.add.text(x, y - 90, n.toString(), {
            fontFamily: 'raster',
            fontSize: '60px'
        }).setStroke('#fff', 6).setOrigin(.5);
        const scoreLabel = scene.add.text(x, y - 10, '环境评分', {fontSize: '36px'}).setStroke('#fff', 6).setOrigin(.5);
        this.container = scene.add.container(scene.sys.canvas.width >> 1, scene.sys.canvas.height, [dumpSprite, bg, stripGraphics, scoreText, scoreLabel]);
    }

    static setEnv(scene: Phaser.Scene, n: number) {
        if (!this.instance) {
            this.instance = new Env(scene, n);
        }
        this.instance.update(n);
    }

    update(n: number) {
        const {x, y, r, w} = Env.cfg;
        const {container} = this,
            [dumpSprite, , stripGraphics, scoreText, scoreLabel] = container.getAll() as [Phaser.GameObjects.Sprite, Phaser.GameObjects.Graphics, Phaser.GameObjects.Graphics, Phaser.GameObjects.Text, Phaser.GameObjects.Text, Phaser.GameObjects.Container];
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

    setHover(hover: boolean) {
        const dumpSprite = this.container.getAt(0) as Phaser.GameObjects.Sprite;
        hover ? dumpSprite.setTint(0x888888) : dumpSprite.clearTint();
    }
}

class Garbage {
    static instance: Garbage;
    garbageSprite: Phaser.GameObjects.Sprite;
    garbageText: Phaser.GameObjects.Text;

    private constructor(private scene: Phaser.Scene, private n: number = 0) {
        const garbageSprite = scene.add.sprite(0, 76, assetName.garbageTexture);
        this.garbageSprite = garbageSprite;
        scene.add.text(scene.sys.canvas.width >> 1, 50, '/10', {
            fontFamily: 'raster',
            fontSize: '60px',
            color: '#999'
        });
        this.garbageText = scene.add.text(scene.sys.canvas.width >> 1, 50, n.toString(), {
            fontFamily: 'raster',
            fontSize: '60px',
            color: '#da2422'
        }).setOrigin(1, 0);
    }

    static setGarbage(scene: Phaser.Scene, n: number): Phaser.GameObjects.Sprite {
        if (!this.instance) {
            this.instance = new Garbage(scene, n);
        }
        this.instance.update(n);
        return this.instance.garbageSprite;
    }

    update(n: number) {
        this.garbageSprite.setFrame(n).setRotation(n);
        this.garbageText.setText((n + 1).toString());
    }
}

class LifeStrip {
    static instance: LifeStrip;
    container: Phaser.GameObjects.Container;

    private constructor(private scene: Phaser.Scene, private n: number = 0) {
        const alpha = .8;
        const bg = scene.add.graphics({fillStyle: {color: 0x020a1e, alpha}})
                .fillRoundedRect(-165, -210, 320, 28, 14),
            strip = scene.add.graphics({fillStyle: {color: 0x18df42, alpha}});
        this.container = scene.add.container(0, 0, [bg, strip]);
    }

    static setLife(scene: Phaser.Scene, n: number): Phaser.GameObjects.Container {
        if (!this.instance) {
            this.instance = new LifeStrip(scene, n);
        }
        this.instance.update(n);
        return this.instance.container;
    }

    update(n: number) {
        const lifeStrip = this.container.getAt(1) as Phaser.GameObjects.Graphics;
        lifeStrip.clear();
        if (n) {
            lifeStrip.fillRoundedRect(-159, -205, 307 * n / CONST.maxLife, 18, 9);
        }
    }
}

class Tips {
    static show(scene: Phaser.Scene, str: string) {
        const stageWidth = scene.sys.canvas.width;
        const y = 500 + ~~(Math.random() * 10) * 50;
        const text = scene.add.text(stageWidth, y, str, {fontSize: '32px'});
        const textBg = scene.add.graphics({
            x: stageWidth,
            y,
            fillStyle: {color: 0x000, alpha: .6}
        }).fillRoundedRect(-32, -14, text.width + 64, 56, 26).setDepth(-1);
        scene.tweens.add({
            targets: [textBg, text],
            x: -stageWidth,
            duration: 8e3,
            onComplete: () => {
                text.destroy();
                textBg.destroy();
            }
        });
    }
}

