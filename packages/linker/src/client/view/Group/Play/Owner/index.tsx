import * as React from 'react'
import * as style from './style.scss'
import {connCtx, Lang} from '@client-util'
import {baseEnum} from '@common'
import {playContext, rootContext, TPlayContext, TRootContext} from '@client-context'
import {Card, List} from '@antd-component'
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
        [PhaseStatus[PlayerStatus.left]]: ['已离开', 'Left']
    })

    render(): React.ReactNode {
        const {props: {group, groupState, history}, lang} = this
        console.log(groupState)
        return <section className={style.console}>
            <Breadcrumb history={history} links={[
                {label: lang.groupConfiguration, to: `/group/configuration/${group.id}`},
                {label: lang.playerList, to: `/group/player/${group.id}`},
                {label: lang.share, to: `/group/share/${group.id}`},
            ]}/>
            <Title label={lang.phaseStatus}/>
            {
                groupState.phaseStates.map((phaseState, i) =>
                    <Card key={i}
                          title={group.phaseConfigs.find(({key}) => key === phaseState.key).title}
                          extra={lang[PhaseStatus[phaseState.status]]}
                          actions={[<a onClick={() => window.open(phaseState.playUrl, '_blank')}>{lang.console}</a>]}
                    >
                        <List
                            dataSource={Object.entries(phaseState.playerStatus)}
                            renderItem={
                                ([playerToken, playerStatus]) =>
                                    <List.Item>
                                        <List.Item.Meta title={playerToken}
                                                        description={lang[PlayerStatus[playerStatus]]}/>
                                    </List.Item>
                            }>
                        </List>
                    </Card>)
            }
        </section>
        return JSON.stringify(groupState.phaseStates)
    }
}