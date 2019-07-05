import * as React from 'react'
import * as style from './style.scss'
import {Button, Input, Radio, Request, Toast} from '@elf/component'
import {Core} from '@bespoke/register'
import {
    CARD,
    DATE,
    DECISION,
    FetchRoute,
    GENDER,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    namespace,
    PAGE,
    PushType
} from '../config'

interface IPlayState {
    answer: string;
    card: CARD;
    stage: STAGE;
    gender: GENDER;
    age: string;
    institute: string;
}

enum STAGE {
    beginning,
    instruction14,
    instruction56,
    playing
}

enum STATUS {
    playing,
    info,
    waiting,
    result
}

const ANSWER_LEN_TO_DECISION = [
    DECISION.one,
    DECISION.two,
    DECISION.three,
    DECISION.four,
    DECISION.five,
    DECISION.six
]

const DECISION_LABEL = {
    [DECISION.one]: '决策1',
    [DECISION.two]: '决策2',
    [DECISION.three]: '决策3',
    [DECISION.four]: '决策4',
    [DECISION.five]: '决策5',
    [DECISION.six]: '决策6'
}

export class Play extends Core.Play<ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    IPlayState> {
    constructor(props) {
        super(props)
        const len = Object.values(props.playerState.answer).length
        const stage =
            len === 4
                ? STAGE.instruction56
                : len > 0
                ? STAGE.playing
                : STAGE.beginning
        this.state = {
            answer: undefined,
            card: undefined,
            stage,
            gender: undefined,
            age: undefined,
            institute: undefined
        }
    }

    componentDidMount(): void {
        const {
            playerState: {actor},
            game
        } = this.props
        Request.get(
            namespace,
            FetchRoute.getUserMobile,
            {gameId: game.id},
            {token: actor.token, actorType: actor.type}
        )
    }

    getPlayerStatus = (): STATUS => {
        const {playerState, gameState} = this.props
        if (gameState.card !== undefined) {
            return STATUS.result
        }
        if (playerState.info) {
            return STATUS.waiting
        }
        if (playerState.answer.hasOwnProperty(DECISION.six)) {
            return STATUS.info
        }
        return STATUS.playing
    }

    renderPlaying = () => {
        const {answer, card, gender, age, institute} = this.state
        const {playerState, gameState, frameEmitter} = this.props
        const status = this.getPlayerStatus()
        switch (status) {
            case STATUS.playing: {
                const decision =
                    ANSWER_LEN_TO_DECISION[Object.values(playerState.answer).length]
                const page: any = PAGE[decision]
                return (
                    <div>
                        {page.instructions &&
                        page.instructions.map((word, i) => {
                            return <p key={i}>{word}</p>
                        })}
                        {page.questions.map(({title, options}, i) => {
                            return (
                                <div key={i}>
                                    <p>{title}</p>
                                    <Radio
                                        value={i === 0 ? answer : card}
                                        options={options}
                                        onChange={val => {
                                            i === 0
                                                ? this.setState({answer: '' + val})
                                                : this.setState({card: val as CARD})
                                        }}
                                    />
                                </div>
                            )
                        })}
                        <Button
                            style={{marginTop: '1rem'}}
                            label={'确定'}
                            onClick={() => {
                                if (page.required.some(required => !this.state[required])) {
                                    return Toast.warn('请选择')
                                }

                                console.log(answer, card)
                                frameEmitter.emit(
                                    MoveType.shout,
                                    {answer: [answer, card], decision},
                                    error => {
                                        Toast.warn(error)
                                    }
                                )
                                if (decision === DECISION.four) {
                                    return this.setState({
                                        stage: STAGE.instruction56,
                                        answer: undefined,
                                        card: undefined
                                    })
                                }
                                this.setState({answer: undefined, card: undefined})
                            }}
                        />
                    </div>
                )
            }
            case STATUS.info: {
                return (
                    <div>
                        <p>
                            问卷决策环节到此结束，下面请填写你的个人信息（我们将严格保密）。
                        </p>
                        <div>
                            <label>性别</label>
                            <Radio
                                value={gender}
                                options={[GENDER.male, GENDER.female]}
                                onChange={val => this.setState({gender: val as GENDER})}
                            />
                        </div>
                        <div>
                            <label>年龄</label>
                            <Input
                                value={age}
                                onChange={e => this.setState({age: '' + e.target.value})}
                            />
                        </div>
                        <div>
                            <label>院系</label>
                            <Input
                                value={institute}
                                onChange={e =>
                                    this.setState({institute: '' + e.target.value})
                                }
                            />
                        </div>
                        <Button
                            style={{marginTop: '1rem'}}
                            label={'确定'}
                            onClick={() => {
                                if (!gender || !age || !institute) {
                                    return Toast.warn('请填写个人信息')
                                }
                                frameEmitter.emit(
                                    MoveType.info,
                                    {gender, age, institute},
                                    error => {
                                        Toast.warn(error)
                                    }
                                )
                            }}
                        />
                    </div>
                )
            }
            case STATUS.waiting: {
                return (
                    <div>
                        <p>等待老师结束实验</p>
                    </div>
                )
            }
            case STATUS.result: {
                return (
                    <div>
                        <p>感谢参加。</p>
                        <p>第一部分抽题为 {DECISION_LABEL[playerState.profitDecision14]}</p>
                        <p>
                            {playerState.profitDecision56
                                ? `你抽中了第二部分，抽题为 ${
                                    DECISION_LABEL[playerState.profitDecision56]
                                    }`
                                : '你没有抽中第二部分'}
                        </p>
                        <p>收益为 {this.renderProfit(playerState.profit)}</p>
                    </div>
                )
            }
        }
    }

    renderProfit = (profit): string => {
        let str = ''
        if (profit[DATE.jul5]) {
            str += `${DATE.jul5}发放${profit[DATE.jul5]} `
        }
        if (profit[DATE.aug4]) {
            str += `${DATE.aug4}发放${profit[DATE.aug4]} `
        }
        if (profit[DATE.oct13]) {
            str += `${DATE.oct13}发放${profit[DATE.oct13]} `
        }
        if (profit[DATE.nov12]) {
            str += `${DATE.nov12}发放${profit[DATE.nov12]} `
        }
        str = str ? str : '没有收益'
        return str
    }

    renderStage = () => {
        const {playerState, gameState} = this.props
        const {stage} = this.state
        switch (stage) {
            case STAGE.beginning: {
                return (
                    <div>
                        <p>欢迎你参加本次决策问卷！</p>
                        <p>
                            本次问卷共有6个决策问题，1-4为个人决策问题，5-6为涉及他人的决策问题。你在本问卷中的所有信息都将保密。
                        </p>
                        <p>
                            我们将按照问卷中你的决策最终实现你的收益，因此，请认真对待每个决策，并根据你真实的偏好做出选择。
                        </p>
                        <p>
                            最终我们将通过微信转账实现你的最终收益，请在最后留下你的准确手机信息。
                        </p>
                        <Button
                            style={{marginTop: '1rem'}}
                            label={'下一页'}
                            onClick={() => {
                                this.setState({stage: STAGE.instruction14})
                            }}
                        />
                    </div>
                )
            }
            case STAGE.instruction14: {
                return (
                    <div>
                        <p>以下为实验第一部分，包括决策问题1-4。</p>
                        <p>
                            决策问题1-4涉及个人决策，最终我们将在4组问题中随机选择1组，并根据你在该组中的选择实现你的最终收益。
                        </p>
                        <p>
                            在这份问卷里，你共需做出5组决策。最后，我们会随机选择6组决策中的一组，并根据你在该决策中的选择实现你最终的收益。每组问题有相同的概率被选中，请认真对待每组决策。
                        </p>
                        <Button
                            style={{marginTop: '1rem'}}
                            label={'下一页'}
                            onClick={() => {
                                this.setState({stage: STAGE.playing})
                            }}
                        />
                    </div>
                )
            }
            case STAGE.instruction56: {
                return (
                    <div>
                        <p>实验第一部分到此结束，下面开始实验第二部分，包括决策问题5-6。</p>
                        <p>
                            决策问题5-6涉及他人，具体来说，你将相应的问题中将决定甲乙双方的收益，其中甲方是你自己，乙方为调查员中随机与你配对的另外一个人（我们已经根据所有调查员的ID号完成随机配对）。与你配对这个人是匿名的，意味着你无法知道他或她的身份。
                        </p>
                        <p>
                            最终，我们会从每一组配对的甲乙双方中随机选择一位，并从其两组决策中随机选择一组，根据其在对应的选择中的决策决定你们双方各自的收入。即：如果你的某一次选择被选中，则你在该选择中的甲方对应你自己的收入，乙方对应与你配对的人的收入。如果与你配对的人的某次选择被选中，则她在该选择中的甲方对应她的收入，乙方对应你的收入。
                        </p>
                        <p>下面请开始你的选择。</p>
                        <Button
                            style={{marginTop: '1rem'}}
                            label={'下一页'}
                            onClick={() => {
                                this.setState({stage: STAGE.playing})
                            }}
                        />
                    </div>
                )
            }
            case STAGE.playing: {
                return this.renderPlaying()
            }
        }
    }

    render() {
        const content = this.renderStage()
        return <section className={style.play}>{content}</section>
    }
}
