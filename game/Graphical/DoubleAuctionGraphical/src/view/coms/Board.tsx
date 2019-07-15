import {span} from '@bespoke-game/graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

interface IBoardItems {
    role?: number
    position?: number
    price?: number
    deal?: boolean
}

interface IBoard {
    playerState: number
    board: Array<IBoardItems>
    role?: number
    dealIt?: Function
    positionIndex: number
}

const Board = ({playerState, board = [], role, dealIt, positionIndex}: IBoard) => {

    const genBG = (boardItem, role, positionIndex) => {
        if (boardItem.positionIndex === positionIndex) {
            return '#fff'
        }
        if (boardItem.role === role) {
            return '#e0e0e0'
        }
        if (boardItem.deal) {
            return '#fff'
        }
        return '#ffe8b2'
    }

    const genBorder = (boardItem) => {
        if (boardItem.deal) {
            return 'none'
        }
        return 'solid 3px #333'
    }

    const genColor = (boardItem) => {
        if (boardItem.deal) {
            return '#ff9800'
        }
        return '#333'
    }

    const genCursor = (boardItem, role, positionIndex) => {
        if (playerState === PlayerStatus.dealed) {
            return 'no-drop'
        }
        if (boardItem.deal) {
            return 'no-drop'
        }
        if (boardItem.role === role) {
            return 'no-drop'
        }
        if (boardItem.positionIndex === positionIndex) {
            return 'no-drop'
        }
        return 'pointer'
    }

    const dealItFunc = (position, price) => {
        if (playerState === PlayerStatus.dealed) {
            return
        }
        dealIt(position, price)
    }

    const ListBuyer = (board = [], role, positionIndex) => {
        return board.filter(b => b && b.role === 1).map((b, i) =>
            <div
                key={`listBuyer${i}`}
                style={{
                    color: genColor(b),
                    margin: '1rem',
                    border: genBorder(b),
                    padding: '.3rem 3rem',
                    borderRadius: '.5rem',
                    background: genBG(b, role, positionIndex),
                    cursor: genCursor(b, role, positionIndex)
                }}
                onClick={(b.role !== role && !b.deal) ? dealItFunc.bind(this, b.position, b.price) : () => {
                }}
            >
                {b.price}
            </div>)
    }
    const ListSeller = (board = [], role, positionIndex) => {
        return board.filter(b => b && b.role === 0).map((b, i) =>
            <div
                key={`listSeller${i}`}
                style={{
                    color: genColor(b),
                    margin: '1rem',
                    border: genBorder(b),
                    padding: '.3rem 3rem',
                    borderRadius: '.5rem',
                    background: genBG(b, role, positionIndex),
                    cursor: genCursor(b, role, positionIndex)
                }}
                onClick={(b.role !== role && !b.deal) ? dealItFunc.bind(this, b.position, b.price) : () => {
                }}
            >
                {b.price}
            </div>)
    }
    if (playerState === PlayerStatus.prepared || playerState === PlayerStatus.shouted || playerState === PlayerStatus.dealed) {
        switch (role) {
            case 0:
                return <>
                    <foreignObject {...{
                        x: span(5),
                        y: span(2.5)
                    }}>
                        <div style={{
                            width: 400,
                            height: 540,
                            border: 'solid 5px #333',
                            borderRadius: 20,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyItems: 'center',
                            alignItems: 'flex-start',
                            fontSize: '1.8rem',
                            padding: '2rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                height: '100%',
                                borderRight: 'solid 5px #333',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                卖方
                                {ListSeller(board, role, positionIndex)}
                            </div>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                height: '100%',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                买方
                                {ListBuyer(board, role, positionIndex)}
                            </div>
                        </div>
                    </foreignObject>
                </>
            case 1:
                return <>
                    <foreignObject {...{
                        x: span(1),
                        y: span(3.5)
                    }}>
                        <div style={{
                            width: 400,
                            height: 540,
                            border: 'solid 5px #333',
                            borderRadius: 20,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyItems: 'center',
                            alignItems: 'flex-start',
                            fontSize: '1.8rem',
                            padding: '2rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                height: '100%',
                                borderRight: 'solid 5px #333',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                卖方
                                {ListSeller(board, role, positionIndex)}
                            </div>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                height: '100%',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                买方
                                {ListBuyer(board, role, positionIndex)}
                            </div>
                        </div>
                    </foreignObject>
                </>
        }
    }
    return null
}

export default Board
