import {asset, assetName} from './asset';
import {CONST, SceneName, span, tileX, tileY, TProps} from './const';
import {Direction, MoveType, PushType} from '../../config';

interface Tile {
    value: number
    sprite: Phaser.GameObjects.Sprite
}

interface TileCoord {
    r: number
    c: number
}

export class MainGame extends Phaser.Scene {
    props: TProps = CONST.props;
    level: number = 1;
    score: number = 0;
    bestScore: number = +(localStorage.getItem(CONST.localStorageName) || 0);
    tileMatrix: Tile[][] = [];
    movingCount: number = 0;
    scoreText: Phaser.GameObjects.Text;
    bestScoreText: Phaser.GameObjects.Text;
    sounds: {
        move: Phaser.Sound.BaseSound,
        grow: Phaser.Sound.BaseSound
    };

    constructor() {
        super({key: SceneName.mainGame});
    }

    get emitter() {
        return this.props.frameEmitter;
    }

    static transTilesByDirection(direction: Direction): TileCoord[][] {
        const tileCoords: TileCoord[][] = [];
        for (let r = 0; r < CONST.row; r++) {
            for (let c = 0; c < CONST.col; c++) {
                const coord: TileCoord = {r, c};
                switch (direction) {
                    case Direction.U:
                        tileCoords[c] = tileCoords[c] || [];
                        tileCoords[c][r] = coord;
                        break;
                    case Direction.R:
                        tileCoords[r] = tileCoords[r] || [];
                        tileCoords[r][CONST.col - 1 - c] = coord;
                        break;
                    case Direction.D:
                        tileCoords[c] = tileCoords[c] || [];
                        tileCoords[c][CONST.row - 1 - r] = coord;
                        break;
                    case Direction.L:
                        tileCoords[r] = tileCoords[r] || [];
                        tileCoords[r][c] = coord;
                        break;
                }
            }
        }
        return tileCoords;
    }

    preload() {
        this.load.image(assetName.tileDefault, asset.tileDefault);
        this.load.image(assetName.restart, asset.restart);
        this.load.image(assetName.score, asset.score);
        this.load.image(assetName.scoreBest, asset.scoreBest);
        this.load.audio(assetName.move, asset.move);
        this.load.audio(assetName.grow, asset.grow);
        this.load.spritesheet(assetName.tiles, asset.tiles, {frameWidth: CONST.tileSize, frameHeight: CONST.tileSize});
    }

    create() {
        this.sounds = {
            move: this.sound.add(assetName.move),
            grow: this.sound.add(assetName.grow)
        };
        this.initEvent();
        this.layout();
        this.addTile();
        this.addTile();
        this.emitter.on(PushType.move, ({token, d}) => {
            if (token !== this.props.playerState.actor.token) {
                return;
            }
            this.sounds.move.play();
            MainGame.transTilesByDirection(d).forEach(tileCoords => {
                let blankCount = 0;
                tileCoords.forEach((fromCoord, i) => {
                    const fromTile = this.tileMatrix[fromCoord.r][fromCoord.c];
                    fromTile.sprite.depth = i;
                    if (fromTile.value === 0) {
                        blankCount++;
                        return;
                    }
                    if (blankCount === 0) {
                        return;
                    }
                    this.moveTile(fromCoord, tileCoords[i - blankCount]);
                });
                const upgradeIndex = tileCoords.findIndex((coord, i) => {
                    if (i === tileCoords.length - 1) {
                        return false;
                    }
                    const nextCoord = tileCoords[i + 1];
                    return this.tileMatrix[coord.r][coord.c].value === this.tileMatrix[nextCoord.r][nextCoord.c].value;
                });
                if (upgradeIndex === -1) {
                    return;
                }
                tileCoords.forEach((fromCoord, i) => {
                    if (i <= upgradeIndex || this.tileMatrix[fromCoord.r][fromCoord.c].value === 0) {
                        return;
                    }
                    this.moveTile(fromCoord, tileCoords[i - 1]);
                });
            });
        });
    }

    initEvent() {
        this.input.on('pointerup', pointer => {
            this.movingCount || this.handleTouch(pointer);
        });
        this.input.keyboard.on('keydown', key => {
            this.movingCount || this.handleKeyDown(key);
        });
    }

    handleTouch({upTime, downTime, upX, upY, downX, downY}: Phaser.Input.Pointer) {
        if (upTime - downTime < CONST.minSwipe.time) {
            return;
        }
        const swipe = new Phaser.Geom.Point(upX - downX, upY - downY),
            magnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        if (magnitude < CONST.minSwipe.magnitude) {
            return;
        }
        const normalizedSwipe = new Phaser.Geom.Point(swipe.x / magnitude, swipe.y / magnitude);
        switch (true) {
            case normalizedSwipe.y < -CONST.minSwipe.normalization:
                this.move(Direction.U);
                break;
            case normalizedSwipe.x > CONST.minSwipe.normalization:
                this.move(Direction.R);
                break;
            case normalizedSwipe.y > CONST.minSwipe.normalization:
                this.move(Direction.D);
                break;
            case normalizedSwipe.x < -CONST.minSwipe.normalization:
                this.move(Direction.L);
                break;
        }
    }

    handleKeyDown({code}: KeyboardEvent) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                this.move(Direction.U);
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.move(Direction.R);
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.move(Direction.D);
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.move(Direction.L);
                break;
        }
    }

    move(direction: Direction) {
        this.emitter.emit(MoveType.move, {d: direction});
    }

    moveTile(fromCoord: TileCoord, toCoord: TileCoord) {
        const fromTile = this.tileMatrix[fromCoord.r][fromCoord.c],
            toTile = this.tileMatrix[toCoord.r][toCoord.c];
        const upgraded = toTile.value === fromTile.value;
        if (upgraded) {
            this.updateScore(Math.pow(2, fromTile.value));
            toTile.value = fromTile.value + 1;
            if (toTile.value > this.level) {
                this.level++;
                this.sounds.grow.play();
            }
        } else {
            toTile.value = fromTile.value;
        }
        fromTile.value = 0;
        this.movingCount++;
        this.tweens.add({
            targets: [fromTile.sprite, toTile.sprite],
            x: tileX(toCoord.c),
            y: tileY(toCoord.r),
            duration: CONST.tweenDuration * (Math.abs(fromCoord.r - toCoord.r) + Math.abs(fromCoord.c - toCoord.c)) / (CONST.row + CONST.col),
            onComplete: () => {
                if (--this.movingCount === 0) {
                    for (let r = 0; r < CONST.row; r++) {
                        for (let c = 0; c < CONST.col; c++) {
                            this.resetTileSprite({r, c});
                        }
                    }
                    this.addTile();
                }
                this.resetTileSprite(fromCoord);
                this.resetTileSprite(toCoord);
            },
            ...upgraded ? {
                alpha: .5,
                scaleX: {value: .5, duration: 50, delay: 50, yoyo: true},
                scaleY: {value: .5, duration: 50, delay: 50, yoyo: true}
            } : null
        });
    }

    updateScore(delta: number) {
        this.score += delta;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem(CONST.localStorageName, this.bestScore.toString());
        }
    }

    resetTileSprite({r, c}: TileCoord) {
        const tile = this.tileMatrix[r][c];
        const {sprite} = tile;
        sprite.x = tileX(c);
        sprite.y = tileY(r);
        if (tile.value > 0) {
            sprite.alpha = 1;
            sprite.setFrame(tile.value - 1);
        } else {
            sprite.alpha = 0;
        }
    }

    layout() {
        const fontSize = 22;
        this.add.sprite(span(.8), span(1), assetName.score);
        this.scoreText = this.add.text(span(.8), span(1), this.score.toString(), {fontSize});
        this.add.sprite(span(1.8), span(1), assetName.scoreBest);
        this.bestScoreText = this.add.text(span(1.8), span(1), this.bestScore.toString(), {fontSize});
        this.add.sprite(span(3), span(1), assetName.restart)
            .setInteractive().on('pointerdown', () => this.scene.start(SceneName.mainGame));
        for (let r = 0; r < CONST.row; r++) {
            this.tileMatrix[r] = [];
            for (let c = 0; c < CONST.col; c++) {
                this.add.sprite(tileX(c), tileY(r), assetName.tileDefault);
                const tile = this.add.sprite(tileX(c), tileY(r), assetName.tiles);
                tile.alpha = 0;
                this.tileMatrix[r][c] = {
                    value: 0,
                    sprite: tile
                };
            }
        }
    }

    addTile() {
        const emptyCoord: Array<TileCoord> = [];
        this.tileMatrix.forEach(
            (row, r) => row.forEach(
                ({value}, c) => value === 0 ? emptyCoord.push({r, c}) : null
            )
        );
        if (!emptyCoord.length) {
            return;
        }
        const targetCoord: TileCoord = Phaser.Utils.Array.GetRandom(emptyCoord) as any,
            targetTile = this.tileMatrix[targetCoord.r][targetCoord.c];
        targetTile.value = 1;
        targetTile.sprite.setFrame(0);
        this.tweens.add({
            targets: [targetTile.sprite],
            alpha: 1,
            duration: CONST.tweenDuration,
            onComplete: () => {
                this.scoreText.setText(this.score.toString());
                this.bestScoreText.setText(this.bestScore.toString());
            }
        });
    }
}
