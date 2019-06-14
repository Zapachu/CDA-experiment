import * as React from 'react'
import * as style from './style.scss'
import {Button, ButtonProps, Core, Lang, MaskLoading, RadioGroup, Toast} from 'bespoke-client-util'
import {EYE_EXAMPLE, EYES, GameStage, GENDER, MoveType, PushType} from '../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {getEnumKeys} from '../util'
import GameResult from './components/GameResult'

// const PhaseOver: React.SFC<{
//     game: IGame<ICreateParams>,
//     frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
// }> = ({game, frameEmitter}) => {
//     return <section className={style.phaseOver}>
//         <p>您已完成该部分的实验，请在实验说明的结果记录表上填写您该部分的实验收益。</p>
//         <p>点击下方按钮，跳转到输入快速加入码页面，并耐心等待实验员发放下一部分实验的快速加入码。</p>
//         <div className={style.btnWrapper}>
//             <Button {...{
//                 label: '进入实验下一部分',
//                 onClick: () => game.params.nextPhaseKey ?
//                     frameEmitter.emit(MoveType.sendBackPlayer) :
//                     location.href = '/bespoke/join'
//             }}/>
//         </div>
//     </section>
// }

interface IPlayState {
    seatNumber?: number
    emotion: number,
    gender: GENDER
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {

    state: IPlayState = {
        emotion: undefined,
        gender: undefined
    }
    lang = Lang.extractLang({
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment'],
        example: ['例', 'Example'],
        theEmotionIs: ['图中人物的表情是', 'The emotion of the character in the picture is'],
        theGenderIs: ['图中人物的性别是', 'The gender of the character in the picture is'],
        wait4CountdownOver: ['等待倒计时结束', 'Waiting for the countdown to end'],
        [GENDER[GENDER.male]]: ['男', 'Male'],
        [GENDER[GENDER.female]]: ['女', 'Female']
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
            <Button width={ButtonProps.Width.medium} label={lang.submit} onClick={() => {
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

    renderMainTestStage(): React.ReactNode {
        const {lang, props: {frameEmitter, game, gameState: {time}, playerState: {result, anwsers}}, state: {emotion, gender}} = this,
          timeLeft = game.params.timeLimit*60 - time,
          timeLeftMin = Math.floor(timeLeft/60),
          timeLeftSec = timeLeft % 60;
        if (result) {
          return <GameResult result={result} total={EYES.length}/>
        }
        const curEye = anwsers ? EYES[anwsers.length] : EYE_EXAMPLE
        new Image().src = EYES[anwsers && anwsers.length + 1 < EYES.length ? anwsers.length + 1 : 0].url //preload
        const genderOptions = getEnumKeys(GENDER).map(key => lang[key]),
            emotionOptions = curEye.items
        return <section className={style.mainTestStage}>
            <div className={style.header}>
                <label>{anwsers ? anwsers.length + 1 : lang.example}、</label>
                <span>{timeLeftMin}:{timeLeftSec}</span>
            </div>
            <img src={curEye.url}/>
            <label>{lang.theGenderIs}</label>
            <RadioGroup options={genderOptions}
                        value={lang[GENDER[gender]]}
                        optionStyle={'50%'}
                        onChange={v => {
                          this.setState({gender: genderOptions.findIndex(o => o === v)})}}
            />
            <label>{lang.theEmotionIs}</label>
            <RadioGroup options={emotionOptions}
                        value={emotionOptions[emotion]}
                        optionStyle={'50%'}
                        onChange={v => this.setState({emotion: emotionOptions.findIndex(o => o === v)})}
            />
            <div className={style.btnWrapper}>
                <Button width={ButtonProps.Width.medium} label={lang.submit} onClick={() => {
                    frameEmitter.emit(MoveType.anwser, {
                        newanwser: {
                            emotion,
                            gender,
                            ...anwsers ? {index: anwsers.length} : {}
                        }
                    })
                    this.setState({gender:undefined, emotion:undefined})
                }}/>
            </div>
            <div className={style.desc} dangerouslySetInnerHTML={{__html:curEye.desc}}/>
        </section>
    }

    renderResultStage(): React.ReactNode {
        const {props: {playerState: {result}}} = this
        if (!result) {
            return <MaskLoading/>
        }
        return <GameResult result={result} total={EYES.length}/> 
    }
}
