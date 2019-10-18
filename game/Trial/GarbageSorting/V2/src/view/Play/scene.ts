import {CONST, GarbageTypes, getGarbageConfig, SceneName, TProps} from './const';
import {GarbageType, MoveType, PushType} from '../../config';

export class MainGame extends Phaser.Scene {
    props: TProps = CONST.props;

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
    }

    create() {
        this.initEvent();
        this.layout();
        this.emitter.on(PushType.sort, ({token, t}) => {
            if (token !== this.props.playerState.actor.token) {
                return;
            }
        });
    }

    initEvent() {
        this.input.on('pointerup', pointer => {
            this.handleTouch(pointer);
        });
    }

    handleTouch(pointer: Phaser.Input.Pointer) {
        console.log(pointer);
    }

    handleKeyDown({code}: KeyboardEvent) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                this.move(GarbageType.harmful);
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.move(GarbageType.kitchen);
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.move(GarbageType.recyclable);
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.move(GarbageType.other);
                break;
        }
    }

    move(direction: GarbageType) {
        this.emitter.emit(MoveType.sort, {t: direction});
    }

    layout() {
        this.add.text(this.sys.canvas.width / 2 - 40, 25, '1/10', {
            fontFamily: 'ArcadeClassic',
            fontSize: '40px',
            color: '#999'
        });
        GarbageTypes.forEach((g, i) => {
            const {bodyName, coverName} = getGarbageConfig(g);
            const body = this.add.sprite(48 + i * 92, 180, bodyName),
                cover = this.add.sprite(48 + i * 92, 120, coverName);
            body.displayWidth = 69;
            body.displayHeight = 103;
            cover.displayWidth = 83;
            cover.displayHeight = 24;
        });
    }
}
