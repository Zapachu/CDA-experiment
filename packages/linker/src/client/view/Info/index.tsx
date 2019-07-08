import * as React from 'react'
import * as style from './style.scss'
import {IBaseGameWithId} from '@common'
import {Api, connCtx, Lang} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {Button, Card, message} from '@antd-component'
import {rootContext, TRootContext} from '@client-context'
import {Loading} from '@client-component'
import {ResponseCode} from '@elf/share'

declare interface IInfoState {
    loading: boolean
    game?: IBaseGameWithId
}

@connCtx(rootContext)
export class Info extends React.Component<TRootContext & RouteComponentProps<{ gameId: string }>, IInfoState> {
    lang = Lang.extractLang({
        enterPlayRoom: ['进入实验', 'Enter play room'],
        joinGame: ['加入实验', 'Join Game'],
        joinSuccess: ['加入成功，即将进入实验房间', 'Join success, enter to play room now'],
        share: ['分享', 'Share'],
        playerList: ['玩家列表', 'PlayerList']
    })

    state: IInfoState = {
        loading: true
    }

    async componentDidMount() {
        const {props: {history, user, match: {params: {gameId}}}} = this
        const {game} = await Api.getBaseGame(gameId)
        if (game.owner === user.id) {
            history.push(`/play/${game.id}`)
            return
        }
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
                            onClick={() => history.push(`/play/${game.id}`)}>{lang.enterPlayRoom}</Button>
                </li>
                <li>
                    <Button type={'primary'}
                            block={true}
                            onClick={() => history.push(`/player/${game.id}`)}>{lang.playerList}</Button>
                </li>
                <li>
                    <Button type={'primary'}
                            block={true}
                            onClick={() => history.push(`/share/${game.id}`)}>{lang.share}</Button>
                </li>
            </ul>,
            btn4Student = <Button
                type={'primary'}
                onClick={async () => {
                    const {code} = await Api.joinGame(game.id)
                    if (code === ResponseCode.success) {
                        await message.success(lang.joinSuccess)
                        history.push(`/play/${game.id}`)
                    }
                }}>{lang.joinGame}</Button>
        return <section className={style.info}>
            <Card title={game.title}>
                {game.desc}
            </Card>
            <div className={style.buttonWrapper}>
                {
                    user.id === game.owner ? btn4Teacher : btn4Student
                }
            </div>
        </section>
    }
}
