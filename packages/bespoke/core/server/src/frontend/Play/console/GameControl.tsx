import * as React from 'react'
import * as style from './style.scss'
import {baseEnum, FrameEmitter, IGameWithId, ISimulatePlayer, TGameState, TPlayerState} from 'bespoke-common'
import {Button, ButtonProps, Lang} from 'bespoke-client-util'
import {Api} from '../../util'

const {notStarted, started, paused, over} = baseEnum.GameStatus

declare interface IGameControlProps {
    game: IGameWithId<{}>
    gameState: TGameState<{}>
    playerStates: { [key: string]: TPlayerState<{}> }
    frameEmitter: FrameEmitter<any, any, any, any>
    historyPush: (path: string) => void
}

export class GameControl extends React.Component<IGameControlProps> {
    lang = Lang.extractLang({
        gameTitle: ['实验名称', 'Game Name'],
        gameStatus: ['实验状态', 'Game Status'],
        notStarted: ['未开始', 'Not Started'],
        started: ['进行中', 'Playing'],
        paused: ['已暂停', 'Paused'],
        over: ['已结束', 'Over'],
        start: ['开始', 'START'],
        pause: ['暂停', 'PAUSE'],
        resume: ['恢复', 'RESUME'],
        stop: ['结束', 'OVER'],
        GameOver: ['实验结束', 'GAME OVER'],
        onlinePlayers: ['当前在线人数', 'Online Players'],
        players: ['实验成员', 'Players']
    })
    gameStatusMachine = {
        [notStarted]: [
            {
                status: started,
                label: this.lang.start
            }
        ],
        [started]: [
            {
                status: over,
                label: this.lang.stop,
                color: ButtonProps.Color.red,
                width: ButtonProps.Width.small
            },
            {
                status: paused,
                label: this.lang.pause
            }
        ],
        [paused]: [
            {
                status: over,
                label: this.lang.stop,
                color: ButtonProps.Color.red,
                width: ButtonProps.Width.small
            },
            {
                status: started,
                label: this.lang.resume
            }
        ]
    }

    render() {
        const {lang, props: {historyPush, game, gameState, playerStates, frameEmitter}} = this
        if (!gameState) {
            return null
        }
        const btnProps = {
            type: ButtonProps.Type.flat,
            color: ButtonProps.Color.blue,
            width: ButtonProps.Width.tiny
        }
        return <section className={style.gameControl}>
            <div className={style.headBar}>
                <div className={style.gameStatus}>
                    <label>{lang.gameStatus}</label>
                    <span>{{
                        [notStarted]: lang.notStarted,
                        [started]: lang.start,
                        [paused]: lang.paused,
                        [over]: lang.over
                    }[gameState.status]}</span>
                </div>
                <div className={style.gameTitle}>
                    <label>{lang.gameTitle}</label>
                    <span>{game.title}</span>
                </div>
                <div className={style.btnGroup}>
                    <Button {...btnProps} icon={ButtonProps.Icon.home} onClick={() => historyPush(`/dashboard`)}/>
                    <Button {...btnProps} icon={ButtonProps.Icon.parameter}
                            onClick={() => historyPush(`/configuration/${game.id}`)}/>
                    {
                        WITH_LINKER ? null : <Button {...btnProps} icon={ButtonProps.Icon.share}
                                                     onClick={() => historyPush(`/share/${game.id}`)}/>
                    }
                </div>
            </div>
            <section className={style.players}>
                <SimulatePlayer gameId={game.id}/>
                <section className={style.onlinePlayers}>
                    <div className={style.onlinePlayersCount}>
                        <label>{lang.onlinePlayers}</label>
                        <span>{Object.values(playerStates).length}</span>
                    </div>
                </section>
            </section>
            <div className={style.statusSwitcher}>
                <div className={style.switcherWrapper}>
                    {
                        (this.gameStatusMachine[gameState.status] || [])
                            .map(({status, label, type = ButtonProps.Type.primary, color = ButtonProps.Color.blue, width = ButtonProps.Width.medium}) =>
                                <Button key={label} {...{
                                    label,
                                    color,
                                    type,
                                    width,
                                    onClick: () => frameEmitter.emit(baseEnum.CoreMove.switchGameStatus, {status})
                                }}/>
                            )
                    }
                    {
                        gameState.status === baseEnum.GameStatus.over ?
                            <div className={style.blankMsg}>{this.lang.GameOver}</div> : null
                    }
                </div>
            </div>
        </section>
    }
}

declare interface ISimulatePlayerWrapperState {
    simulateName?: string
    simulateNameSeq: number
    simulatePlayers: Array<ISimulatePlayer>
}

class SimulatePlayer extends React.Component<{ gameId: string }, ISimulatePlayerWrapperState> {
    NAMES = ['宋远桥', '俞莲舟', '俞岱岩', '张松溪', '张翠山', '殷梨亭', '莫声谷', '马钰', '丘处机', '谭处端', '王处一', '郝大通', '刘处玄', '孙不二']
    MAX_SIZE = 20

    state: ISimulatePlayerWrapperState = {
        simulateNameSeq: 0,
        simulatePlayers: []
    }
    lang = Lang.extractLang({
        SimulatePlayer: ['模拟玩家', 'SimulatePlayer'],
        Add: ['添加', 'ADD'],
        StartAll: ['全部启动', 'Start All']
    })

    async componentDidMount() {
        const {simulatePlayers} = await Api.getSimulatePlayers(this.props.gameId)
        this.setState({simulatePlayers, simulateNameSeq: simulatePlayers.length})
    }

    async addSimulatePlayer() {
        const {MAX_SIZE, props: {gameId}, state: {simulatePlayers, simulateName, simulateNameSeq}} = this
        if (simulatePlayers.length >= MAX_SIZE) {
            return
        }
        const name = simulateName || this.NAMES[simulateNameSeq]
        const {token} = await Api.newSimulatePlayer(gameId, name)
        this.setState(({simulatePlayers}) => ({
            simulateName: '',
            simulateNameSeq: (simulateNameSeq + 1) % this.NAMES.length,
            simulatePlayers: [...simulatePlayers, {gameId, token, name}]
        }))
    }

    render() {
        const {lang, state: {simulatePlayers, simulateName = '', simulateNameSeq}} = this
        return <section className={style.simulatePlayer}>
            <div className={style.header}>
                <label>{lang.SimulatePlayer}({simulatePlayers.length}/{this.MAX_SIZE})</label>
                <div className={style.addWrapper}>
                    <input value={simulateName} placeholder={this.NAMES[simulateNameSeq]}
                           onChange={({target: {value: simulateName}}) => this.setState({simulateName})}/>
                    <span onClick={() => this.addSimulatePlayer()}>{lang.Add}</span>
                </div>
            </div>
            <div className={style.playerNames}>
                {
                    simulatePlayers.map(({token, name}) =>
                        <a key={token} href={`${window.location.origin}${window.location.pathname}?token=${token}`}
                           target='_blank'>{name}</a>)
                }
                {
                    simulatePlayers.length > 3 ?
                        <a className={style.startAll}
                           onClick={() => simulatePlayers.forEach(({token}) => window.open(`${window.location.origin}${window.location.pathname}?token=${token}`, '_blank'))}>
                            {lang.StartAll}</a> : null
                }
            </div>
        </section>
    }
}
