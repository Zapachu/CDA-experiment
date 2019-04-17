import {span} from 'bespoke-game-graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

const Board = ({playerState, board, role, dealIt}: any) => {
    console.log(playerState)
    if (playerState === PlayerStatus.prepared) {
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
                                height: '100%;',
                                borderRight: 'solid 5px #333',
                                justifyContent: 'center'
                            }}>
                                卖方
                            </div>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                height: '100%;',
                                justifyContent: 'center'
                            }}>
                                买方
                            </div>
                        </div>
                    </foreignObject>
                </>
            case 1:
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
                                height: '100%;',
                                borderRight: 'solid 5px #333',
                                justifyContent: 'center'
                            }}>
                                卖方
                            </div>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                height: '100%;',
                                justifyContent: 'center'
                            }}>
                                买方
                            </div>
                        </div>
                    </foreignObject>
                </>
        }
    }
    return null
}

export default Board
