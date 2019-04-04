import * as React from 'react'
import * as style from './style.scss'
import {connCtx, Lang} from '@client-util'
import {baseEnum, IPlayerState} from '@common'
import {playContext, rootContext, TPlayContext, TRootContext} from '@client-context'
import {Card, List, Button} from '@antd-component'
import {Breadcrumb, Title} from '@client-component'
import {History} from 'history'

const {PhaseStatus, PlayerStatus} = baseEnum

@connCtx(rootContext)
@connCtx(playContext)
export class Play4Owner extends React.Component<TRootContext & TPlayContext & { history: History }> {
    lang = Lang.extractLang({
        gameConfiguration: ['实验配置信息', 'GameConfiguration'],
        share: ['分享', 'Share'],
        gameList: ['实验列表', 'GameList'],
        playerList: ['玩家列表', 'PlayerList'],
        console: ['控制台', 'Console'],
        [PhaseStatus[PhaseStatus.playing]]: ['进行中', 'Playing'],
        [PhaseStatus[PhaseStatus.paused]]: ['已暂停', 'Paused'],
        [PhaseStatus[PhaseStatus.closed]]: ['已关闭', 'Closed'],
        playerStatus: ['玩家状态', 'Player Status'],
        [PlayerStatus[PlayerStatus.playing]]: ['进行中', 'Playing'],
        [PlayerStatus[PlayerStatus.left]]: ['已离开', 'Left'],
        point: ['得分', 'Point'],
        uniKey: ['唯一标识', 'UniKey'],
        detail: ['详情', 'Detail'],
        reward: ['奖励', 'Reward']
    })

    render(): React.ReactNode {
        const {props: {game, gameState, history}, lang} = this
        console.log(gameState)
        return <section className={style.console}>
            <Breadcrumb history={history} links={[
                {label: lang.gameList, to: `/`},
                {label: lang.gameConfiguration, to: `/configuration/${game.id}`},
                {label: lang.playerList, to: `/player/${game.id}`},
                {label: lang.share, to: `/share/${game.id}`}
            ]}/>
            <Title label={lang.playerStatus}/>
            <List
                dataSource={gameState.phaseStates}
                grid={{gutter: 12, column: 2}}
                renderItem={(phaseState, i) =>
                    <List.Item>
                        <Card key={i}
                              title={game.phaseConfigs.find(({key}) => key === phaseState.key).title}
                              extra={lang[PhaseStatus[phaseState.status]]}
                              actions={[<Button onClick={
                                  () => window.open(phaseState.playUrl, '_blank')
                              }>{lang.console}</Button>]}
                        >
                            <List dataSource={Object.entries(phaseState.playerState)}
                                  grid={{gutter: 12, column: 3}}
                                  renderItem={
                                      ([playerToken, {actor, status, phaseResult = {}}]: [string, IPlayerState]) =>
                                          <List.Item>
                                              <List.Item.Meta
                                                  title={`${actor.userName}:${lang[PlayerStatus[status]] || ''}`}
                                                  description={
                                                      <div className={style.phaseResult}>
                                                          {
                                                              phaseResult.point ?
                                                                  <span>{lang.point}&nbsp;&nbsp;{phaseResult.point}</span> : null
                                                          }
                                                          {
                                                              phaseResult.uniKey ?
                                                                  <span>{lang.uniKey}&nbsp;&nbsp;{phaseResult.uniKey}</span> : null
                                                          }
                                                          {
                                                              phaseResult.detailIframeUrl ?
                                                                  <a href={phaseResult.detailIframeUrl}
                                                                     target='_blank'>{lang.detail}</a> : null
                                                          }
                                                      </div>
                                                  }/>
                                          </List.Item>
                                  }>
                            </List>
                        </Card>
                    </List.Item>
                }/>
        </section>
    }
}
