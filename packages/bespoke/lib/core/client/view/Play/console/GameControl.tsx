import * as React from 'react'
import * as style from './style.scss'
import {baseEnum, FrameEmitter, IGameWithId, ISimulatePlayer, TGameState} from '@dev/common'
import {Api, Lang, Button} from '@dev/client'

const {notStarted, started, paused, over} = baseEnum.GameStatus

export const GameControlHeight = '12rem'

declare interface IGameControlProps {
    game: IGameWithId<{}>
    gameState: TGameState<{}>
    frameEmitter: FrameEmitter<any, any, any, any>
    historyPush: (path: string) => void
}

export class GameControl extends React.Component<IGameControlProps> {
    lang = Lang.extractLang({
        SwitchGameStatus_start: ['开始', 'START'],
        SwitchGameStatus_pause: ['暂停', 'PAUSE'],
        SwitchGameStatus_resume: ['恢复', 'RESUME'],
        SwitchGameStatus_over: ['结束', 'OVER'],
        GameOver: ['实验结束', 'GAME OVER']
    })
    gameStatusMachine = {
        [notStarted]: [
            {
                status: started,
                label: this.lang.SwitchGameStatus_start
            }
        ],
        [started]: [
            {
                status: over,
                label: this.lang.SwitchGameStatus_over,
                color: Button.Color.red,
                width: Button.Width.small
            },
            {
                status: paused,
                label: this.lang.SwitchGameStatus_pause
            }
        ],
        [paused]: [
            {
                status: over,
                label: this.lang.SwitchGameStatus_over,
                color: Button.Color.red,
                width: Button.Width.small
            },
            {
                status: started,
                label: this.lang.SwitchGameStatus_resume
            }
        ]
    }

    render() {
        const {props: {historyPush, game, gameState, frameEmitter}} = this
        if (!gameState) {
            return null
        }
        const btnProps = {
            type: Button.Type.flat,
            color: Button.Color.blue,
            width: Button.Width.tiny
        }
        return <section className={style.gameControl} style={{height: GameControlHeight}}>
            <div className={style.statusSwitcher}>
                <div className={style.btnGroup}>
                    <Button {...btnProps} icon={Button.Icon.home} onClick={() => historyPush(`/dashboard`)}/>
                    <Button {...btnProps} icon={Button.Icon.parameter}
                            onClick={() => historyPush(`/configuration/${game.id}`)}/>
                    <Button {...btnProps} icon={Button.Icon.share} onClick={() => historyPush(`/share/${game.id}`)}/>
                </div>
                <div className={style.switcherWrapper}>
                    {
                        (this.gameStatusMachine[gameState.status] || [])
                            .map(({status, label, type = Button.Type.primary, color = Button.Color.blue, width = Button.Width.medium}) =>
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
            <SimulatePlayer gameId={game.id}/>
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
            <div className={style.players}>
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