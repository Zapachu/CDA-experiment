import {CONST, SceneName} from './const';
import {GarbageConfig, GarbageType, MoveType, PlayerStatus, PushType} from '../../config';
import {asset, assetName} from './asset';

interface IPointer {
    x: number
    y: number
}

type IState = Partial<{
    index: number
    env: number
    life: number
    garbageIndex: number
    score: number
}>

export class MainGame extends Phaser.Scene {
    state: IState = {
        index: 0,
        env: 1000,
        life: 100,
        score: 0,
        garbageIndex: -1
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
        this.load.atlas(assetName.TFTexture, asset.TFTexture, asset.TFAtlas);
        this.load.image(assetName.particle, asset.particle);
        this.load.image(assetName.btnSkip, asset.btnSkip);
        this.load.image(assetName.guideBg, asset.guideBg);
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
        this.setState(this.state);
        CONST.emitter.on(PushType.sync, ({i, t, env, life, garbageIndex, index, score, status}) => {
            if (!this.sys.game || this.scene.isPaused()) {
                return;
            }
            if (this.state.index === index) {
                this.shouldOver(status);
                this.setState({env, life, garbageIndex, score});
            } else {
                this.setState({env});
                t === GarbageType.skip ? Tips.show(this, `有人将${GarbageConfig[i].label}随手扔入垃圾堆`) : null;
                return;
            }
        });
        CONST.emitter.emit(MoveType.prepare, {}, ({env, life, garbageIndex, index, status, score}) => {
            this.shouldOver(status);
            if (index === undefined) {
                this.add.text(this.sys.canvas.width >> 1, this.sys.canvas.height - 240, '加入游戏失败！', {
                    fontSize: '28px',
                    color: '#da2422'
                }).setOrigin(.5);
                this.scene.pause();
                return;
            }
            Guide.init(this, () => this.setState({env, life, garbageIndex, index, score}));
        });
        // this.add.rectangle(125,145, 750, 1334, 0x000000, .1).setOrigin(0,0)
    }

    shouldOver(status: PlayerStatus) {
        if (this.sys.game && status === PlayerStatus.result) {
            this.sys.game.destroy(true);
            CONST.overCallBack();
        }
    }

    setState(state: IState) {
        Object.assign(this.state, state);
        state.env !== undefined ? Env.setEnv(this, this.state.env) : null;
        state.life !== undefined ? LifeStrip.setLife(this, this.state.life) : null;
        state.score !== undefined ? Score.setScore(this, this.state.score) : null;
        if (state.garbageIndex >= 0) {
            Garbage.setGarbage(this, this.state.garbageIndex);
            BtnSkip.instance.playBurning();
        }
    }

    submit(t: GarbageType) {
        const i = this.state.garbageIndex;
        if (t === GarbageType.skip) {
            Env.instance.feedback(CONST.pollutionOfSkip);
        } else {
            Can.get(t).feedback(GarbageConfig[i].type === t);
            if (GarbageConfig[i].type !== t) {
                Env.instance.feedback(CONST.pollutionOfWrong);
                Score.instance.feedback(CONST.wrongScore);
            } else {
                Score.instance.feedback(CONST.rightScore);
            }
        }
        CONST.emitter.emit(MoveType.submit, {i, t});
    }

    update(time: number, delta: number): void {
        BtnSkip.update();
    }
}

class BtnSkip {
    static instance: BtnSkip;
    container: Phaser.GameObjects.Container;
    burningTween: Phaser.Tweens.Tween;

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
            y: stageHeight - 225 - btnSkip.height / 2
        }).fillRect(0, 0, 306, 68);
        btnSkip.mask = new Phaser.Display.Masks.GeometryMask(scene, mask);
        const btnSkipLabel = scene.add.text(0, 0, '懒得分类', {
            fontFamily: 'Open Sans',
            fontSize: '28px',
            color: '#ffffff',
        }).setOrigin(.5, .5).setAlpha(.9);
        btnSkipLabel.mask = btnSkip.mask;
        this.burningTween = scene.tweens.create({
            targets: [particles],
            x: {from: 0, to: -btnSkip.width},
            duration: CONST.sortSeconds * 1000,
            onComplete: () => this.onClick()
        });
        this.container = scene.add.container(stageWidth >> 1, stageHeight - 225, [btnSkip, btnSkipLabel, particles, mask]).setDepth(10);
    }

    static init(scene: Phaser.Scene, onClick: (pointer: IPointer) => void) {
        if (this.instance) {
            return;
        }
        this.instance = new BtnSkip(scene, onClick);
    }

    static update() {
        const [btnSkip, , particles, mask] = this.instance.container.getAll() as [Phaser.GameObjects.Sprite, Phaser.GameObjects.Sprite, Phaser.GameObjects.Particles.ParticleEmitterManager, Phaser.GameObjects.Graphics];
        mask.clear().fillRoundedRect(0, 0, btnSkip.width + particles.x, btnSkip.height, {
            tl: 0, bl: 0, tr: btnSkip.height >> 1, br: btnSkip.height >> 1
        });
    }

    playBurning() {
        this.burningTween.restart().play();
    }
}

enum PlayerAnimation {
    up = 'down',
    down = 'up',
}

class Player {
    static readonly MoveArea = {
        left: 289, right: 721, top: 505, bottom: 1185, bottomTrigger: 1105, topTrigger: 585
    };
    static readonly InitPosition: IPointer = {x: 505, y: 905};
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
            duration: Phaser.Geom.Point.GetMagnitude(new Phaser.Geom.Point(dX, dY)) >> 1,
            onComplete: () => callback()
        });
    }
}

class Can {
    static readonly cfg = {
        baseX: 221,
        baseY: 385,
        xStep: 184,
        cans: [GarbageType.harmful, GarbageType.kitchen, GarbageType.recyclable, GarbageType.other]
    };
    static instances: { [key: number]: Can } = {};
    container: Phaser.GameObjects.Container;
    feedbackTween: Phaser.Tweens.Tween;

    private constructor(public type: GarbageType, private scene: Phaser.Scene, onClick: (pointer: IPointer) => void) {
        const {bodyFrame, coverFrame, label} = Can.getCanConfig(this.type),
            bodySprite = scene.add.sprite(0, 120, assetName.canTexture, bodyFrame),
            coverSprite = scene.add.sprite(0, 0, assetName.canTexture, coverFrame),
            nameText = scene.add.text(-18 - label.length * 5, 144, label, {
                fontSize: '18px',
                fontFamily: 'Open Sans',
            }),
            feedbackSprite = scene.add.sprite(0, -50, assetName.TFTexture).setScale(0);
        this.feedbackTween = this.scene.tweens.create({
            targets: [feedbackSprite],
            scale: {from: 0, to: 1},
            y: -75,
            ease: 'Power2',
            yoyo: true,
            duration: 200,
            hold: 1e3
        });
        bodySprite.setInteractive();
        bodySprite.on('pointerdown', pointer => onClick(pointer));
        this.container = scene.add.container(Can.cfg.baseX + this.type * Can.cfg.xStep, Can.cfg.baseY, [bodySprite, coverSprite, nameText, feedbackSprite]);
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

    feedback(b: boolean) {
        const feedBackSprite = this.feedbackTween.targets[0] as Phaser.GameObjects.Sprite;
        feedBackSprite.setFrame(b.toString());
        this.feedbackTween.play();
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
    feedbackTween: Phaser.Tweens.Tween;

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
        const stripGraphics = scene.add.graphics({lineStyle: {width: w}}),
            scoreText = scene.add.text(x, y - 90, n.toString(), {
                fontFamily: 'raster',
                fontSize: '60px'
            }).setStroke('#fff', 6).setOrigin(.5),
            scoreLabel = scene.add.text(x, y - 10, '环境评分', {
                fontSize: '36px',
                fontFamily: 'Open Sans',
            }).setStroke('#fff', 6).setOrigin(.5),
            feedBackText = scene.add.text(x, y, '', {
                fontSize: '40px',
                fontFamily: 'raster',
                color: '#da2422'
            }).setAlpha(0).setOrigin(.5);
        this.feedbackTween = this.scene.tweens.create({
            targets: [feedBackText],
            alpha: {from: 1, to: 0},
            y: y + r / 2,
            duration: 1e3
        });
        this.container = scene.add.container(scene.sys.canvas.width >> 1, scene.sys.canvas.height - 145, [dumpSprite, bg, stripGraphics, scoreText, scoreLabel, feedBackText]);
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

    feedback(n: number) {
        const {x, y, r} = Env.cfg;
        const feedBackText = this.feedbackTween.targets[0] as Phaser.GameObjects.Text;
        feedBackText.setPosition(x + 2 * (Math.random() - .5) * r, y - r / 2);
        feedBackText.setText(`-${n}`);
        this.feedbackTween.play();
    }
}

class Garbage {
    static instance: Garbage;
    garbageSprite: Phaser.GameObjects.Sprite;
    garbageText: Phaser.GameObjects.Text;

    private constructor(private scene: Phaser.Scene, private n: number = 0) {
        this.garbageSprite = scene.add.sprite(0, 76, assetName.garbageTexture);
        const textX = 225, textY = 180
        scene.add.text(textX, textY, '/10', {
            fontFamily: 'raster',
            fontSize: '48px',
            color: '#999'
        });
        this.garbageText = scene.add.text(textX, textY, n.toString(), {
            fontFamily: 'raster',
            fontSize: '48px',
            color: '#999'
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

    private constructor(private scene: Phaser.Scene, private n: number = 100) {
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
        const text = scene.add.text(stageWidth, y, str, {
            fontSize: '32px', fontFamily: 'Open Sans',
        });
        const textBg = scene.add.graphics({
            x: stageWidth,
            y,
            fillStyle: {color: 0x000, alpha: .6}
        }).fillRoundedRect(-32, -10, text.width + 64, 56, 26).setDepth(-1);
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

class Score {
    static instance: Score;
    container: Phaser.GameObjects.Container;
    feedbackTween: Phaser.Tweens.Tween;

    private constructor(private scene: Phaser.Scene, private n: number = 0) {
        const feedBackText = scene.add.text(0, 0, '', {
            fontSize: '40px',
            fontFamily: 'raster',
            color: '#999'
        }).setAlpha(0).setOrigin(.5);
        this.feedbackTween = this.scene.tweens.create({
            targets: [feedBackText],
            alpha: {from: 1, to: 0},
            y: 0,
            duration: 1e3
        });
        this.container = scene.add.container(scene.sys.canvas.width - 285, 180, [
            scene.add.text(-12, 2, '得分', {
                fontFamily: 'Open Sans',
                fontSize: '40px',
                color: '#999'
            }).setOrigin(1, 0),
            scene.add.text(24, 0, n.toString(), {
                fontFamily: 'raster',
                fontSize: '48px',
                color: '#999'
            }),
            scene.add.text(0, 6, ':', {
                fontFamily: 'raster',
                fontSize: '40px',
                color: '#999'
            }),
        ]);
    }

    static setScore(scene: Phaser.Scene, n: number): Phaser.GameObjects.Container {
        if (!this.instance) {
            this.instance = new Score(scene, n);
        }
        this.instance.update(n);
        return this.instance.container;
    }

    update(n: number) {
        const scoreText = this.container.getAt(1) as Phaser.GameObjects.Text;
        scoreText.setText(n.toString());
    }

    feedback(n: number) {
        const feedBackText = this.feedbackTween.targets[0] as Phaser.GameObjects.Text;
        feedBackText.setPosition(this.scene.sys.canvas.width - 245 + 2 * (Math.random() - .5) * 80, 225);
        feedBackText.setText(`+${n}`);
        this.feedbackTween.play();
    }
}

class Guide {
    static instance: Guide;
    container: Phaser.GameObjects.Container;

    private readonly secondTips = '点击上方分类垃圾桶或拖动小人进行垃圾分类;\n进行垃圾分类将会消耗体力值,获取正确的得分';

    private constructor(private scene: Phaser.Scene, private onDone: () => void) {
        const btnSkip = scene.add.text(-295, 12, '跳过', {
                fontFamily: 'Open Sans',
                fontSize: '36px',
                color: '#aaa'
            }),
            btnNext = scene.add.text(190, 12, '下一步', {
                fontFamily: 'Open Sans',
                fontSize: '36px',
                color: '#ff3434'
            });
        this.container = scene.add.container(scene.sys.canvas.width >> 1, 595, [
            scene.add.rectangle(0, 225, scene.sys.canvas.width, scene.sys.canvas.height, 0x00000, 0).setInteractive(),
            scene.add.sprite(0, 0, assetName.guideBg),
            scene.add.text(0, -40, '超时未分类或点击"随地乱扔"视为污染环境行为\n会造成对环境总分的下降,但是不会消耗体力值', {
                fontFamily: 'Open Sans',
                fontSize: '28px',
                color: '#666'
            }).setLineSpacing(5).setOrigin(.5),
            btnSkip,
            btnNext
        ]).setDepth(20);
        btnSkip.setInteractive().on('pointerdown', () => btnSkip.setScale(.9));
        btnSkip.setInteractive().on('pointerup', () => this.done());
        btnNext.setInteractive().on('pointerdown', () => btnNext.setScale(.9));
        btnNext.setInteractive().on('pointerup', () => {
            btnNext.setScale(1);
            this.next();
        });
    }

    static init(scene: Phaser.Scene, onDone: () => void) {
        if (!this.instance) {
            this.instance = new Guide(scene, onDone);
        }
    }

    done() {
        this.container.destroy(true);
        this.onDone();
    }

    next() {
        const tipsText = this.container.getAt(2) as Phaser.GameObjects.Text;
        if (tipsText.text === this.secondTips) {
            this.done();
        } else {
            tipsText.setText(this.secondTips);
            this.scene.tweens.add({
                targets: [tipsText],
                scaleY: {from: 1, to: 0},
                yoyo: true,
                duration: 100
            });
        }
    }
}
