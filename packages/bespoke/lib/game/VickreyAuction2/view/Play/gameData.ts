import {TImgGroup} from '../util/imgGroup'

export const gameData = new class {
    imageGroup: TImgGroup
    cellSize = 100
    col = 10

    get stageSize() {
        return this.cellSize * this.col
    }

    span(n: number) {
        return this.cellSize * n
    }
}

