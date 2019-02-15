import * as React from 'react'
import * as style from './style.scss'
import {IBaseGameWithId, baseEnum} from '@common'
import {Api, connCtx, Lang} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {Button, Card, message} from '@antd-component'
import {rootContext, TRootContext} from '@client-context'
import {Breadcrumb, Loading} from '@client-component'
import {AcademusRole} from '../../../../common/baseEnum'

declare interface IInfoState {
    loading: boolean
    game?: IBaseGameWithId
}

@connCtx(rootContext)
export class Info extends React.Component<TRootContext & RouteComponentProps<{ gameId: string }>, IInfoState> {
    lang = Lang.extractLang({
        back2Game: ['返回实验', 'Back to game'],
        enterPlayRoom: ['进入实验', 'Enter play room'],
        joinGroup: ['加入实验', 'Join Game'],
        joinSuccess: ['加入成功，即将进入实验房间', 'Join success, enter to play room now'],
        share: ['分享', 'Share'],
        playerList: ['玩家列表', 'PlayerList'],
    })

    state: IInfoState = {
        loading: true
    }

    async componentDidMount() {
        const {props: {match: {params: {gameId}}}} = this
        const {game} = await Api.getBaseGame(gameId)
        this.setState({
            loading: false,
            game
        })
    }

    render(): React.ReactNode {
        const {lang, props: {history, user}, state: {loading, game}} = this
        if (loading || !user) {
            return <Loading/>
        }
        const btn4Teacher = <ul>
            <li>
                <Button type={'primary'}
                    block={true}
                    onClick={() => history.push(`/group/play/${game.id}`)}>{lang.enterPlayRoom}</Button>
            </li>
            <li>
                <Button type={'primary'}
                    block={true}
                    onClick={() => history.push(`/group/player/${game.id}`)}>{lang.playerList}</Button>
            </li>
            <li>
                <Button type={'primary'}
                    block={true}
                    onClick={() => history.push(`/group/share/${game.id}`)}>{lang.share}</Button>
            </li>
        </ul> ,
            btn4Student = <Button
                type={'primary'}
                onClick={async () => {
                    const {code} = await Api.joinGame(game.id)
                    if (code === baseEnum.ResponseCode.success) {
                        await message.success(lang.joinSuccess)
                        history.push(`/group/play/${game.id}`)
                    }
                }}>{lang.joinGroup}</Button>
        return <section className={style.groupInfo}>
            <Breadcrumb history={history} links={user.role === AcademusRole.teacher ? [
                {label: lang.back2Game, to: `/game/info/${game.id}`}
            ] : []}/>
            <Card title={game.title}>
                {game.desc}
            </Card>
            <div className={style.buttonWrapper}>
                {
                    user.role === AcademusRole.teacher ? btn4Teacher : btn4Student
                }
            </div>
        </section>
    }
}