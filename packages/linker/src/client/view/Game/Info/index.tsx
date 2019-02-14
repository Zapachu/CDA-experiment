import * as React from 'react'
import * as style from './style.scss'
import {RouteComponentProps} from 'react-router'
import {IGameWithId, IGroupWithId} from '@common'
import {Api, Lang} from '@client-util'
import {Card, List, Button} from '@antd-component'
import {Breadcrumb, Loading, Title} from '@client-component'
import {Link} from 'react-router-dom'

interface IInfoState {
    loading: boolean,
    groupList?: Array<IGroupWithId>,
    game?: IGameWithId
}

const {Item: ListItem} = List, {Meta: ListItemMeta} = ListItem


export class Info extends React.Component<RouteComponentProps<{ gameId: string }>, IInfoState> {
    lang = Lang.extractLang({
        gameList: ['实验列表', 'GameList'],
        create: ['创建', 'CREATE'],
        view: ['查看', 'VIEW'],
        console: ['控制台', 'CONSOLE'],
        gameInfo: ['实验信息', 'Game Info'],
        groups: ['实验组', 'Groups']
    })
    state: IInfoState = {
        loading: true
    }

    async componentDidMount() {
        const {props: {match: {params: {gameId}}}} = this
        const {game} = await Api.getGame(gameId)
        const {groupList} = await Api.getGroupList(gameId)
        this.setState({loading: false, game, groupList})
    }

    render(): React.ReactNode {
        const {lang, props: {history}, state: {loading, game, groupList}} = this
        if (!loading) {
            return <section className={style.gameInfo}>
                <Breadcrumb history={history} links={[
                    {to: '/game', label: lang.gameList}
                ]}/>
                <div>
                    <Title label={lang.gameInfo}/>
                    <Card title={game.title}>
                        {game.desc}
                    </Card>
                </div>
                <div>
                    <Title label={lang.groups}/>
                    <List dataSource={groupList} renderItem={group =>
                        <ListItem actions={[
                            <Link to={`/group/info/${group.id}`}>{lang.view}</Link>,
                            <Link to={`/group/play/${group.id}`}>{lang.console}</Link>
                        ]}>
                            <ListItemMeta title={group.title} description={group.desc}/>
                        </ListItem>}/>
                    <div className={style.createBtnWrapper}>
                        <Button type={'primary'}
                                onClick={() => history.push(`/group/create/${game.id}`)}>{lang.create}</Button>
                    </div>
                </div>
            </section>
        } else {
            return <Loading/>
        }
    }
}