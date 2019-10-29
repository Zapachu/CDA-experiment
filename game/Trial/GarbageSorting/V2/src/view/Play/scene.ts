import {CONST, GarbageTypes, getGarbageConfig, SceneName, TProps} from './const';
import {GarbageType, PushType} from '../../config';
import {asset, assetName} from './asset';

interface IPointer {
    x: number
    y: number
}

const ENV_CONFIG = {
    x: 189, y: 585, r: 90, w: 18
};

enum AnimName {
    up = 'down',
    down = 'up',
}

const PlayerMoveFrames = {
    down: [
        {key: assetName.player01, url: asset.player01},
        {key: assetName.player02, url: asset.player02},
        {key: assetName.player03, url: asset.player03},
        {key: assetName.player04, url: asset.player04},
    ],
    up: [
        {key: assetName.player11, url: asset.player11},
        {key: assetName.player12, url: asset.player12},
        {key: assetName.player13, url: asset.player13},
        {key: assetName.player14, url: asset.player14},
        {key: assetName.player15, url: asset.player15},
        {key: assetName.player16, url: asset.player16}
    ]
};
const GarbageTextures = [
    {key: assetName.garbage01, url: asset.garbage01},
    {key: assetName.garbage02, url: asset.garbage02},
    {key: assetName.garbage03, url: asset.garbage03},
    {key: assetName.garbage04, url: asset.garbage04},
    {key: assetName.garbage05, url: asset.garbage05},
    {key: assetName.garbage06, url: asset.garbage06},
    {key: assetName.garbage07, url: asset.garbage07},
    {key: assetName.garbage08, url: asset.garbage08},
    {key: assetName.garbage09, url: asset.garbage09},
    {key: assetName.garbage10, url: asset.garbage10},
];

export class MainGame extends Phaser.Scene {
    props: TProps = CONST.props;
    playerContainer: Phaser.GameObjects.Container;
    lifeStrip: Phaser.GameObjects.Container;
    garbageSprite: Phaser.GameObjects.Sprite;
    garbageCanCovers: Array<Phaser.GameObjects.Sprite> = [];
    envContainer: Phaser.GameObjects.Container;
    env = 100;

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
        PlayerMoveFrames.up.map(({key, url}) => this.load.image(key, url));
        PlayerMoveFrames.down.map(({key, url}) => this.load.image(key, url));
        GarbageTextures.map(({key, url}) => this.load.image(key, url));
        this.load.atlas(assetName.dumpTexture, asset.dumpTexture, asset.dumpAtlas);
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
        this.drawPlayer();
        this.setEnv(100);
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

    formatDragPointer(pointer: IPointer): IPointer {
        let x = pointer.x, y = pointer.y;
        x = Math.max(82, x);
        x = Math.min(x, 298);
        y = Math.max(180, y);
        y = Math.min(y, 590);
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
            if (y < 280) {
                const type = GarbageTypes[Math.round((x - 48) / 92)];
                GarbageTypes.forEach(t => {
                    t === type ? this.hoverCan(t) : this.leaveCan(t);
                });
            }
        });
    }

    endDrag(pointer) {
        const {playerSprite, garbageSprite} = this;
        const {x, y} = this.formatDragPointer(pointer);
        this.movePlayer({x: 190, y: 400}, () => {
            playerSprite.anims.stop();
            playerSprite.setTexture(assetName.player01);
            garbageSprite.setVisible(true);
        });
        GarbageTypes.forEach(t => this.leaveCan(t));
        const dumpSprite = this.envContainer.getAt(0) as Phaser.GameObjects.Sprite;
        if (y >= Math.min(590, this.stageHeight - dumpSprite.height)) {
            this.submit();
        } else if (y < 280) {
            const type = GarbageTypes[Math.round((x - 48) / 92)];
            this.submit(type);
        }
    }

    submit(type?: GarbageType) {
        if (this.env >= 20) {
            this.setEnv(this.env -= 20);
        }
        if (type === undefined) {
            this.showTips(`懒得分类，丢入垃圾堆`);
        } else {
            this.showTips(`丢入垃圾箱: ${getGarbageConfig(type).label}`);
        }
        this.setGarbage(~~(Math.random() * 10));
    }

    //endregion

    drawPlayer() {
        this.anims.create({
            key: AnimName.up,
            frames: PlayerMoveFrames.up as any,
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: AnimName.down,
            frames: PlayerMoveFrames.down as any,
            frameRate: 12,
            repeat: -1,
        });
        const container = this.add.container(190, 400),
            shadowSprite = this.add.graphics({
                x: 0,
                y: 75,
                fillStyle: {color: 0x000, alpha: .5}
            }).fillCircle(0, 0, 50).setScale(1, .25),
            playerSprite = this.add.sprite(0, 0, assetName.player01);
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
        container.add(this.setGarbage(5));
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

    setGarbage(n: number) {
        if (this.garbageSprite) {
            this.garbageSprite.setTexture(GarbageTextures[n].key);
        } else {
            const garbageSprite = this.add.sprite(0, 38, GarbageTextures[n].key);
            garbageSprite.displayWidth = 70;
            garbageSprite.displayHeight = 70;
            this.garbageSprite = garbageSprite;
        }
        return this.garbageSprite;
    }

    setLife(n: number): Phaser.GameObjects.Container {
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
        lifeStrip.clear().fillRoundedRect(-79.5, -102.5, 153.5 * n / CONST.maxLife, 9, 4.5);
        return this.lifeStrip;
    }

    setEnv(n: number) {
        const {x, y, r, w} = ENV_CONFIG;
        if (this.envContainer) {
            const strip = this.envContainer.getAt(1) as Phaser.GameObjects.Graphics;
            strip.clear();
        } else {
            const envContainer = this.add.container(0, 0);
            const dumpSprite = this.add.sprite(this.stageWidth >> 1, this.stageHeight, assetName.dumpTexture);
            envContainer.add(dumpSprite);
            const bg = this.add.graphics({lineStyle: {width: w, color: 0xd3d3d3}, fillStyle: {color: 0xd3d3d3}});
            bg.beginPath();
            bg.arc(x, y, r, Phaser.Math.DegToRad(-180), Phaser.Math.DegToRad(0));
            bg.strokePath();
            bg.closePath();
            bg.fillCircle(x - r, y, w >> 1);
            bg.fillCircle(x + r, y, w >> 1);
            envContainer.add(bg);
            envContainer.add(this.add.graphics({
                lineStyle: {width: w, color: 0x5efa2c},
                fillStyle: {color: 0x5efa2c}
            }));
            envContainer.add(this.add.text(x, y - 60, n.toString(), {
                fontFamily: 'raster',
                fontSize: '30px',
                color: '#da2422'
            }));
            this.envContainer = envContainer;
        }
        const {envContainer} = this,
            [dumpSprite, , strip, score] = envContainer.getAll() as [Phaser.GameObjects.Sprite, Phaser.GameObjects.Graphics, Phaser.GameObjects.Graphics, Phaser.GameObjects.Text];
        dumpSprite.setInteractive();
        dumpSprite.setFrame(`0${~~((CONST.maxEnv - n) / CONST.envStep)}.png`);
        dumpSprite.setDisplayOrigin(dumpSprite.width >> 1, dumpSprite.height);
        dumpSprite.removeAllListeners().on('pointerdown', pointer => {
            this.dragPlayer(pointer);
            window.setTimeout(() => this.endDrag(pointer), 4e2);
        });
        const angle = -Math.PI * (1 - n / CONST.maxEnv);
        strip.clear().beginPath();
        strip.arc(x, y, r, -Math.PI, angle);
        strip.strokePath();
        strip.closePath();
        if(n){
            strip.fillCircle(x - r, y, w >> 1);
            strip.fillCircle(x + window.Math.cos(angle) * r, y + window.Math.sin(angle) * r, w >> 1);
        }
        score.setText(n.toString());
        score.displayOriginX = score.width>>1
    }
}
