import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client'
import {Button, ButtonProps, Lang, MaskLoading, Dice} from '@elf/component'
import {GameType, MoveType, PushType, Role, cardGame, LRGame, PlayerStatus} from '../config'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {Header, HistoryTable, Matrix, BtnGroup} from './component'

interface IPlayState {
    choice: number
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {

    lang = Lang.extractLang({
        seatNumber: ['请输入座位号', 'Input Your Seat Number Please'],
        fieldInvalid: [$1 => `${$1}有误，请检查`, $1 => `${$1} is invalid , please check it`],
        seatNumberHasBeenOccupied: ['该座位已被占用', 'This seatNumber has been occupied]'],
        matchingPlayer: ['正在匹配其它玩家...', 'Matching the other player for you...'],
        waiting4theOtherPlayer: ['等待其它玩家输入...', 'Waiting for input from other players...']
    })

    state: IPlayState = {
        choice: 0
    }

    componentDidMount() {
        const {frameEmitter} = this.props
        frameEmitter.emit(MoveType.getRole)
    }

    get historyList() {
        const {gameState, playerState} = this.props,
            {periodIndices} = playerState
        const periodDict: { [index: string]: GameState.IPeriod } = {}
        gameState.periods.forEach(period => periodDict[period.index] = period)
        const historyList = []
        periodIndices.map(i => {
            if (!periodDict[i]) {
                return
            }
            const {index, aChoice, bChoice, aEarning, bEarning, dieRoll} = periodDict[i]
            historyList.push([index + 1, aChoice, bChoice, aEarning, bEarning, dieRoll])
        })
        return historyList
    }

    render(): React.ReactNode {
        const {lang, props: {game:{params:{gameType}}, playerState: {playerStatus, pairId}}} = this
        if (!pairId) {
            return <MaskLoading label={lang.matchingPlayer}/>
        }
        if (playerStatus === PlayerStatus.waiting) {
            return <MaskLoading label={lang.waiting4theOtherPlayer}/>
        }
        return <section className={style.play}>
            {
                gameType === GameType.Card? this.renderCardGame():this.renderLeftRightGame()
            }
        </section>
    }

    renderCardGame() {
        const {props: {gameState: {periods, periodIndex}, playerState: {role, playerStatus, periodIndices, profit}, frameEmitter}, state: {choice}} = this
        const theLastPeriod = periods.find(({index}) => index === periodIndices[periodIndices.length - 1])
        return <section className={style.cardGame}>
            <Header {...{
                period: periodIndex,
                role: cardGame.roleName[role],
                roleB: role === Role.B,
                balance: profit,
                showTimer: playerStatus === PlayerStatus.playing
            }}/>
            <div className={style.playWrapper}>
                <div className={style.outcomeMatrixWrapper}>
                    <Matrix {...{
                        roleNames: cardGame.roleName,
                        options: cardGame.cards,
                        matrix: cardGame.outcomeMatrix4Player1,
                        ...playerStatus === PlayerStatus.result ? {
                            activeRow: theLastPeriod.aChoice,
                            activeCol: theLastPeriod.bChoice
                        } : role === Role.A ? {
                            activeRow: choice
                        } : {
                            activeCol: choice
                        }
                    }}/>
                </div>
                <div className={style.operatePanelWrapper}>
                    {
                        playerStatus === PlayerStatus.result ? <React.Fragment>
                                <div className={style.proceedBtnWrapper}>
                                    <Button label='Proceed'
                                            width={ButtonProps.Width.small}
                                            onClick={() => frameEmitter.emit(MoveType.proceed)}/>
                                </div>
                                ,
                                <section key='roundDetailWrapper' className={style.roundDetailWrapper}>
                                    <ul className={`${style.roleA} ${role === Role.A ? style.active : ''}`}>
                                        <li>Player1's Move : <em>{cardGame.cards[theLastPeriod.aChoice]}</em></li>
                                        <li>Player1's Earnings : <em>{theLastPeriod.aEarning}</em></li>
                                    </ul>
                                    <ul className={`${style.roleB} ${role === Role.B ? style.active : ''}`}>
                                        <li>Player2's Move : <em>{cardGame.cards[theLastPeriod.bChoice]}</em></li>
                                        <li>Player2's Earnings : <em>{theLastPeriod.bEarning}</em></li>
                                    </ul>
                                </section>
                            </React.Fragment> :
                            <BtnGroup {...{
                                options: cardGame.cards,
                                activeIndex: choice,
                                onChange: index => this.setState({choice: index}),
                                onConfirm: () => frameEmitter.emit(MoveType.submitMove, {choice})
                            }}/>
                    }
                </div>
            </div>
            <HistoryTable {...{
                historyList: this.historyList,
                tableHeads: ['Period', 'Player 1\'s Card', 'Player 2\'s Card', 'Player 1\'s Earnings', 'Player 2\'s Earnings'],
                options: cardGame.cards
            }}/>
        </section>
    }

    renderLeftRightGame() {
        const {props: {frameEmitter, gameState: {periods, periodIndex}, playerState: {playerStatus, role, periodIndices, profit}}, state: {choice}} = this
        const theLastPeriod = periods.find(({index}) => index === periodIndices[periodIndices.length - 1]) || {
            aChoice: -1, bChoice: -1, aEarning: 0, bEarning: 0, dieRoll: 0
        }
        return <section className={style.LRGame}>
            <Header {...{
                period: periodIndex,
                role: LRGame.roleName[role],
                roleB: role === Role.B,
                balance: profit,
                showTimer: playerStatus === PlayerStatus.playing
            }}/>
            <div className={style.playWrapper}>
                <div className={style.matrix4small}>
                    <Matrix {...{
                        key: theLastPeriod.dieRoll,
                        roleNames: LRGame.roleName,
                        dices: [1, 2],
                        dieRoll: theLastPeriod.dieRoll,
                        options: LRGame.options,
                        matrix: LRGame.outcomeMatrix4Player1.small,
                        ...playerStatus === PlayerStatus.result ? {
                            activeRow: theLastPeriod.aChoice,
                            activeCol: theLastPeriod.bChoice
                        } : role === Role.A ? {
                            activeRow: choice
                        } : {
                            activeCol: choice
                        }
                    }}/>
                </div>
                <div className={style.matrix4big}>
                    <Matrix {...{
                        key: theLastPeriod.dieRoll,
                        roleNames: LRGame.roleName,
                        dices: [3, 4, 5, 6],
                        dieRoll: theLastPeriod.dieRoll,
                        options: LRGame.options,
                        matrix: LRGame.outcomeMatrix4Player1.big,
                        ...playerStatus === PlayerStatus.result ? {
                            activeRow: theLastPeriod.aChoice,
                            activeCol: theLastPeriod.bChoice
                        } : role === Role.A ? {
                            activeRow: choice
                        } : {
                            activeCol: choice
                        }
                    }}/>
                </div>
                {
                    playerStatus === PlayerStatus.result ? [
                        <div key='resultDiceWrapper' className={style.resultDiceWrapper}>
                            <div className={style.resultDice}>
                                <Dice number={theLastPeriod.dieRoll} showAnimation={true}/>
                            </div>
                            <Button label='Proceed'
                                    width={ButtonProps.Width.small}
                                    onClick={() => frameEmitter.emit(MoveType.proceed)}/>
                        </div>,
                        <section key='roundDetailWrapper' className={style.roundDetailWrapper}>
                            <ul className={`${style.roleA} ${role === Role.A ? style.active : ''}`}>
                                <li>Seeker's Move : <em>{LRGame.options[theLastPeriod.aChoice]}</em></li>
                                <li>Seeker's Earnings : <em>{theLastPeriod.aEarning}</em></li>
                            </ul>
                            <ul className={`${style.roleB} ${role === Role.B ? style.active : ''}`}>
                                <li>Hider's Move : <em>{LRGame.options[theLastPeriod.bChoice]}</em></li>
                                <li>Hider's Earnings : <em>{theLastPeriod.bEarning}</em></li>
                            </ul>
                        </section>
                    ] : <BtnGroup {...{
                        options: LRGame.options,
                        activeIndex: choice,
                        onChange: index => this.setState({choice: index}),
                        onConfirm: () => frameEmitter.emit(MoveType.submitMove, {choice})
                    }
                                  }/>
                }
            </div>
            <HistoryTable {...{
                historyList: this.historyList,
                tableHeads: ['Period', 'Seeker\'s Move', 'Hider\'s Move', 'Seeker\'s Earnings', 'Hider\'s Earnings', 'Die Roll'],
                options: LRGame.options
            }}/>
        </section>
    }
}