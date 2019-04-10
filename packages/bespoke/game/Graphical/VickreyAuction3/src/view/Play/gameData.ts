import {TImgGroup} from 'bespoke-game-graphical-util'

export enum Direction {
    L, R
}

export enum Role {
    player,
    partner,
    other
}

interface Player {
    direction: Direction
    role: Role
}

export const gameData = new class {
    imageGroup: TImgGroup
    cellSize = 100
    col = 10

    players: Array<Player> = [
        {
            direction: Direction.R,
            role: Role.other
        },
        {
            direction: Direction.R,
            role: Role.partner
        },
        {
            direction: Direction.L,
            role: Role.player
        },
        {
            direction: Direction.L,
            role: Role.other
        }
    ]

    get stageSize() {
        return this.cellSize * this.col
    }
}

export function span(n: number | string) {
    return gameData.cellSize * +n
}

