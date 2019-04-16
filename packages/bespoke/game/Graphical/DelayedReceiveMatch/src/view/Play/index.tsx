import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading} from 'bespoke-client-util'
import {span, Stage, ImgLoader, Shadow} from 'bespoke-game-graphical-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {FetchType, MoveType, PushType} from '../../config'

function Player({active}: { active: boolean }) {
    return <ImgLoader src={[
        require('./img/body1.svg'),
        require('./img/body2.svg'),
        require('./img/body3.svg'),
        require('./img/body4.svg'),
        require('./img/face1.svg'),
        require('./img/face2.svg'),
        require('./img/face3.svg'),
        require('./img/face4.svg'),
        require('./img/hair1.svg'),
        require('./img/hair2.svg'),
        require('./img/hair3.svg'),
        require('./img/hair4.svg'),
        require('./img/playerBack.svg')
    ]} render={
        ({images: [body1, body2, body3, body4, face1, face2, face3, face4, hair1, hair2, hair3, hair4, playerBack]}) => {
            const bodyResources = [body1, body2, body3, body4],
                body = bodyResources[~~(Math.random() * bodyResources.length)]
            const faceResources = [face1, face2, face3, face4],
                face = faceResources[~~(Math.random() * faceResources.length)]
            const hairResources = [hair1, hair2, hair3, hair4],
                hair = hairResources[~~(Math.random() * hairResources.length)]
            return <g>
                <g transform={`translate(0,${span(3)})`}>
                    <Shadow active={active}/>
                </g>
                <image href={body.src} x={-body.width >> 1} y={span(.75)}/>
                <image href={face.src} x={-face.width >> 1} y={span(.15)}/>
                <image href={hair.src} x={-hair.width >> 1}/>
            </g>
        }
    }/>
}

interface IPlayState {
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    lang = Lang.extractLang({
        matchPlayers: ['正在匹配玩家...', 'Matching other players...']
        // enterMarket: ['进入市场', 'Enter Market'],
        // shout: ['报价', 'Shout'],
        // toNewRound: [n => `${n} 秒后进入下一轮`, n => `Market will enter into next round in ${n}s`]
    })

    componentDidMount(): void {
        const {props: {frameEmitter}} = this
        frameEmitter.emit(MoveType.getPosition)
    }

    render(): React.ReactNode {
        const {lang, props: {game: {params: {groupSize}}, gameState: {groups}, playerState: {groupIndex, positionIndex, rounds}}} = this
        if (groupIndex === undefined) {
            return <MaskLoading label={lang.matchPlayers}/>
        }
        const ROW_SIZE = 4, PLAYER_POSITION =6
        const {roundIndex} = groups[groupIndex],
            {privatePrices} = rounds[roundIndex]
        return <section className={style.play}>
            <Stage dev={true}>
                <>
                    {
                        positionIndex
                    }
                    {privatePrices.toString()}

                </>
                <g transform={`translate(${span(1.2)},${span(4)})`}>
                    {
                        Array(groupSize).fill(null)
                            .map((_, i) => i === PLAYER_POSITION ? positionIndex : i === positionIndex ? PLAYER_POSITION : i)
                            .map(i =>
                                <g transform={`translate(${span(2.1 * (i % ROW_SIZE) + ~~(i / ROW_SIZE))},${span(~~(i / ROW_SIZE) * 1.5)})`}>
                                    <Player key={i} active={i === positionIndex}/>
                                    <text>{i}</text>
                                </g>
                            )
                    }
                </g>
            </Stage>
        </section>
    }
}
