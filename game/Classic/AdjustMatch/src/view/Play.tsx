import * as React from 'react'
import * as Extend from '@extend/client'
import {Button, Tag} from 'antd'
import * as style from './style.scss'
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerStatus,
    PushType
} from '../config'
import {Lang, MaskLoading} from '@elf/component'
import {DragTable} from './component/DragTable'

function RoundPlay({playerRoundState, gameRoundState, frameEmitter, playerIndex}) {
    const lang = Lang.extractLang({
        good:['物品','Good'],
        privateValue:['心理价值','Private Value'],
        goodStatus:['物品状态','Good Status'],
        beingOwned: ['被持有', 'Being owned'],
        beingOwnedByYou: ['被你持有', 'Being owned by you'],
    })
    const {oldFlag} = gameRoundState, {privatePrices} = playerRoundState
    const [sort, setSort] = React.useState(privatePrices.map((_, i) => i))
    const data = sort.map(i => ({
        key: i,
        price: privatePrices[i],
        isOld: oldFlag[i],
        isYou: i === playerIndex
    }))
    const colStyle: React.CSSProperties = {
        minWidth: '6rem',
        maxWidth: '12rem'
    }
    return <section className={style.roundPlay}>
        <DragTable columns={[
            {
                title: lang.good,
                dataIndex: 'key',
                key: 'key',
                render: v => <div style={colStyle}>{v+1}</div>
            },
            {
                title: lang.privateValue,
                dataIndex: 'price',
                key: 'price',
                render: v => <div style={colStyle}>{v}</div>
            },
            {
                title: lang.goodStatus,
                dataIndex: 'isOld',
                key: 'isOld',
                render: (isOld, {isYou}) => <div style={colStyle}>
                    {
                        isOld ? isYou ?
                            <Tag color='green'>{lang.beingOwnedByYou}</Tag> :
                            <Tag color='blue'>{lang.beingOwned}</Tag> : null
                    }
                </div>
            }
        ]} data={data} setData={data => setSort(data.map(({key}) => key))}/>
        <Button onClick={() => frameEmitter.emit(MoveType.submit, {sort})}>Submit</Button>
    </section>
}

class GroupPlay extends Extend.Group.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    render(): React.ReactNode {
        const {props: {playerState, gameState, frameEmitter}} = this
        if (playerState.status === PlayerStatus.guide) {
            return <section>
                <Button onClick={() => frameEmitter.emit(MoveType.guideDone)}>Start</Button>
            </section>
        }
        if (playerState.status === PlayerStatus.result) {
            return <section>
                Result
            </section>
        }
        const playerRoundState = playerState.rounds[gameState.round],
            gameRoundState = gameState.rounds[gameState.round]
        if (!playerRoundState) {
            return <MaskLoading/>
        }
        return <RoundPlay {...{
            playerRoundState,
            gameRoundState,
            frameEmitter,
            playerIndex: playerState.index
        }}/>
    }
}

export class Play extends Extend.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupPlay = GroupPlay
}