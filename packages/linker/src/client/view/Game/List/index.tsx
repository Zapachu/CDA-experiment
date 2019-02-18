import * as React from 'react'
import * as style from './style.scss'
import {Api, Lang} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {IGameWithId} from '@common'
import {Button, List} from '@antd-component'
import {Link} from 'react-router-dom'
import {Title} from '@client-component'

const {Item: ListItem} = List, {Meta: ListItemMeta} = ListItem

interface IGameListState {
    gameList: Array<IGameWithId>
}

export class GameList extends React.Component<RouteComponentProps<{}>, IGameListState> {
    lang = Lang.extractLang({
        createdGames: ['已创建实验', 'Created games'],
        create: ['创建', 'CREATE'],
        view: ['查看', 'VIEW'],
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        cancel: ['取消', 'Cancel'],
        submit: ['提交', 'Submit'],
        published: ['已发布', 'Published'],
        unpublished: ['未发布', 'Unpublished'],
    })

    state: IGameListState = {
        gameList: [],
    }

    async componentDidMount() {
        const {gameList} = await Api.getGameList()
        this.setState({gameList})
    }

    render(): React.ReactNode {
        const {lang, state: {gameList}, props: {history}} = this
        return <section className={style.gameList}>
            <Title label={lang.createdGames}/>
            <List dataSource={gameList}
                  renderItem={game => <ListItem actions={[<Link to={`/game/info/${game.id}`}>{lang.view}</Link>]}>
                      <ListItemMeta title={game.title} description={game.desc}/>
                      <div className={game.published?style.publishedStatus:''}>{game.published?lang.published:lang.unpublished}</div>
                  </ListItem>}/>
            <div className={style.createBtnWrapper}>
                <Button type={'primary'} onClick={() => history.push('/game/create')}>{lang.create}</Button>
            </div>
        </section>
    }
}