import * as React from 'react'
import * as style from './style.scss'
import {connCtx, Lang, Api} from '@client-util'
import {baseEnum, IPlayerState} from '@common'
import {playContext, rootContext, TPlayContext, TRootContext} from '@client-context'
import {Card, List, message} from '@antd-component'
import {Breadcrumb, Title} from '@client-component'
import {History} from 'history'

const {PhaseStatus, PlayerStatus} = baseEnum

@connCtx(rootContext)
@connCtx(playContext)
export class Play4Owner extends React.Component<TRootContext & TPlayContext & { history: History }> {
    lang = Lang.extractLang({
        groupConfiguration: ['实验组配置信息', 'GroupConfiguration'],
        share: ['分享', 'Share'],
        playerList: ['玩家列表', 'PlayerList'],
        phaseStatus: ['环节状态', 'Phase Status'],
        console: ['控制台', 'Console'],
        [PhaseStatus[PhaseStatus.playing]]: ['进行中', 'Playing'],
        [PhaseStatus[PhaseStatus.paused]]: ['已暂停', 'Paused'],
        [PhaseStatus[PhaseStatus.closed]]: ['已关闭', 'Closed'],
        playerStatus: ['玩家状态', 'Player Status'],
        [PhaseStatus[PlayerStatus.playing]]: ['进行中', 'Playing'],
        [PhaseStatus[PlayerStatus.left]]: ['已离开', 'Left'],
        reward: ['奖励', 'Reward']
    })

    render(): React.ReactNode {
        const {props: {user, game, groupState, history}, lang} = this
        console.log(groupState)
        return <section className={style.console}>
            <Breadcrumb history={history} links={[
                {label: lang.groupConfiguration, to: `/group/configuration/${game.id}`},
                {label: lang.playerList, to: `/group/player/${game.id}`},
                {label: lang.share, to: `/group/share/${game.id}`}
            ]}/>
            <Title label={lang.phaseStatus}/>
            {
                groupState.phaseStates.map((phaseState, i) =>
                    <Card key={i}
                          title={game.phaseConfigs.find(({key}) => key === phaseState.key).title}
                          extra={lang[PhaseStatus[phaseState.status]]}
                          actions={[<a onClick={() => window.open(phaseState.playUrl, '_blank')}>{lang.console}</a>]}
                    >
                        <List
                            dataSource={Object.entries(phaseState.playerState)}
                            renderItem={
                                ([playerToken, {actor, status, phasePlayer}]: [string, IPlayerState]) =>
                                    <List.Item>
                                        <List.Item.Meta title={`Token : ${playerToken}`}
                                                        description={
                                                            `${actor.userName}:${lang[PlayerStatus[status]]}
                                                               ${JSON.stringify(phasePlayer || '')}
                                                            `
                                                        }/>
                                        <RewardPanel {...{
                                            orgCode: user.orgCode,
                                            gameId: game.id,
                                            playerId: actor.playerId,
                                            userId: actor.userId
                                        }}/>
                                    </List.Item>
                            }>
                        </List>
                    </Card>)
            }
        </section>
    }
}

declare type TRewardPanelProps = {
    orgCode: string
    gameId: string
    playerId: string
    userId: string
}

declare type TRewardPanelState = {
    money: number | string
    rewarding: boolean
    reward: number
}

class RewardPanel extends React.Component<TRewardPanelProps, TRewardPanelState> {
    lang = Lang.extractLang({
        InvalidAwardAmount: ['奖励金额有误', 'InvalidAwardAmount'],
        RewardFailed: ['奖励失败', 'RewardFailed'],
        RewardSuccess: ['奖励成功', 'RewardSuccess'],
        Rewarded: ['已奖励', 'Rewarded'],
        Reward: ['奖励', 'Reward'],
        Submit: ['提交', 'Submit']
    })

    async componentDidMount() {
        const {props: {playerId}} = this
        if (!playerId) {
            return
        }
        const {code, reward} = await Api.getRewarded(playerId)
        if (code == baseEnum.ResponseCode.success) {
            this.setState({
                reward: +reward
            })
        }
    }

    state = {
        money: '',
        rewarding: false,
        reward: 0
    }

    render() {
        const {
            lang,
            props: {orgCode, gameId, playerId, userId},
            state: {money, rewarding, reward}
        } = this
        return <section className={style.rewardPanel}>
            <div className={style.rewardedMoney}>
                <label>{lang.Rewarded}</label>
                <em>{reward}</em>
            </div>
            <div className={style.rewardInputSpan}>
                <input {...{
                    className: `${style.rewardInput} ${rewarding ? style.active : ''}`,
                    type: 'number',
                    value: money,
                    onChange: (({target: {value: money}}) => this.setState({money}))
                }}/>
                <a {...{
                    className: style.rewardBtn,
                    onClick: () => {
                        if (rewarding) {
                            const _money = Number(money)
                            if (isNaN(_money) || _money <= 0) {
                                return message.warn(lang.InvalidAwardAmount)
                            }
                            Api.reward(orgCode, gameId, {
                                money: _money,
                                subject: 11,
                                task: gameId,
                                tasker: playerId,
                                payeeId: userId
                            }).then(({code, msg}) => {
                                if (code !== baseEnum.AcademusResCode.success) {
                                    message.error(`${lang.RewardFailed},${msg}`)
                                } else {
                                    message.success(lang.RewardSuccess)
                                    this.setState({
                                        money: '',
                                        rewarding: false,
                                        reward: reward + _money
                                    })
                                }
                            })
                        } else {
                            this.setState({
                                rewarding: true
                            })
                        }
                    }
                }}>{rewarding ? lang.Submit : lang.Reward}</a>
            </div>
        </section>
    }
}