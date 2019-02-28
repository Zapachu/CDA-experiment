import * as React from 'react'
import * as style from './style.scss'
import {Button, Core, FrameEmitter, IGame, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {FetchType, GameStage, MoveType, PushType} from '../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'

const PhaseOver: React.SFC<{
    game: IGame<ICreateParams>,
    frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
}> = ({game, frameEmitter}) => {
    return <section className={style.phaseOver}>
        <p>您已完成该部分的实验，请在实验说明的结果记录表上填写您该部分的实验收益。</p>
        <p>点击下方按钮，跳转到输入快速加入码页面，并耐心等待实验员发放下一部分实验的快速加入码。</p>
        <div className={style.btnWrapper}>
            <Button {...{
                label: '进入实验下一部分',
                onClick: () => game.params.nextPhaseKey ?
                    frameEmitter.emit(MoveType.sendBackPlayer) :
                    location.href = '/bespoke/join'
            }}/>
        </div>
    </section>
}

interface IPlayState {
    seatNumber?: number
    nums: Array<number>
    input: string
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {

    state: IPlayState = {
        nums: this.genRandomNums(),
        input: ''
    }
    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment']
    })

    render(): React.ReactNode {
        const {props: {gameState: {gameStage}}} = this
        return <section className={style.play}>
            {
                (() => {
                    switch (gameStage) {
                        case GameStage.seatNumber: {
                            return this.renderSeatNumberStage()
                        }
                        case GameStage.mainTest: {
                            return this.renderMainTestStage()
                        }
                        case GameStage.result: {
                            return this.renderResultStage()
                        }
                    }
                })()
            }
        </section>
    }

    renderSeatNumberStage(): React.ReactNode {
        const {lang, props: {frameEmitter, playerState}, state: {seatNumber}} = this
        if (playerState.seatNumber) {
            return <MaskLoading label={lang.wait4StartMainTest}/>
        }
        return <section className={style.seatNumberStage}>
            <label>{lang.inputSeatNumberPls}</label>
            <input type='number'
                   value={seatNumber || ''}
                   onChange={({target: {value: seatNumber}}) => this.setState({seatNumber: seatNumber.substr(0, 4)} as any)}/>
            <Button width={Button.Width.medium} label={lang.submit} onClick={() => {
                if (isNaN(Number(seatNumber))) {
                    return Toast.warn(lang.invalidSeatNumber)
                }
                frameEmitter.emit(MoveType.submitSeatNumber, {seatNumber}, success => {
                    if (!success) {
                        Toast.warn(lang.invalidSeatNumber)
                    }
                })
            }}/>
        </section>
    }

    genRandomNums(): Array<number> {
        const MIN = 100
        const MAX = 1000
        return new Array(4).fill('').map(_ => {
            return Math.floor(Math.random() * (MAX - MIN)) + MIN
        })
    }

    checkInput(): Boolean {
        const {nums, input} = this.state
        if (!input || !parseInt(input)) return false
        return nums.includes(parseInt(input)) && nums.every(n => n <= parseInt(input))
    }

    renderMainTestStage(): React.ReactNode {
        const {lang, props: {frameEmitter, game, gameState: {time}}, state: {nums, input}} = this,
            timeLeft = game.params.timeLimit - time

        return <section className={style.mainTestStage}>
            <p style={{fontSize: '18px'}}>倒计时<em>{time > 0 ? timeLeft : ''}</em>
            </p>
            <p style={{margin: '2rem 0'}}>请从下列四个数中选出最大的一个数</p>
            <ul>
                {nums.map(n => <li>{n}</li>)}
            </ul>
            {
                time > 0 ?
                    <React.Fragment>
                        <div style={{margin: '2rem 0'}}>
                            <span>请输入最大的数字</span>
                            <input value={input} onChange={e => this.setState({input: e.target.value})}/>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button {...{
                                label: lang.confirm,
                                onClick: () => {
                                    if (this.checkInput()) {
                                        frameEmitter.emit(MoveType.countReaction)
                                        this.setState({
                                            nums: this.genRandomNums(),
                                            input: ''
                                        })
                                    } else {
                                        Toast.info('输入不正确')
                                    }
                                }
                            }}/>
                        </div>
                    </React.Fragment> : <p className={style.gameWillStart}>该部部分实验将在<em>{-time}</em>秒之后开始</p>
            }
        </section>
    }

    renderResultStage(): React.ReactNode {
        const {props: {game, frameEmitter, playerState: {correctNumber, point}}} = this
        if (isNaN(point)) {
            return <MaskLoading/>
        }
        return <section className={style.result}>
            <p>在该部分的实验中，您一共答对了：<em>{correctNumber}</em>道题，您的收益为：<em>{point}</em> 人民币</p>
            <PhaseOver {...{game, frameEmitter}}/>
        </section>
    }
}
