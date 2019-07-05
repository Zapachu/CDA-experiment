import * as React from 'react'
import * as style from './style.scss'
import {connCtx, Lang} from '@client-util'
import {baseEnum} from '@common'
import {playContext, rootContext, TPlayContext, TRootContext} from '@client-context'
import {Link} from 'react-router-dom'
import {Affix, Dropdown, Button, Menu} from '@antd-component'
import {History} from 'history'

const {PhaseStatus, PlayerStatus} = baseEnum

@connCtx(rootContext)
@connCtx(playContext)
export class Play4Owner extends React.Component<TRootContext & TPlayContext & { history: History }> {
    lang = Lang.extractLang({
        share: ['分享', 'Share'],
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
        const {props: {game, gameState}, lang} = this
        return <section className={style.console}>
            <Affix style={{position: 'absolute', right: 32}} offsetTop={64}>
                <Dropdown overlay={<Menu>
                    <Menu.Item>
                        <Link to={`/player/${game.id}`}>{lang.playerList}</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to={`/share/${game.id}`}>{lang.share}</Link>
                    </Menu.Item>
                </Menu>}>
                    <Button type='primary' shape="circle" icon="bars" />
                </Dropdown>
            </Affix>
            <iframe className={style.playIframe}
                    src={`${gameState.phaseStates[0].playUrl}?${Lang.key}=${Lang.activeLanguage}`}/>
        </section>
    }
}
