import * as React from 'react'
import * as style from './style.scss'
import {Api, Lang} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {IGameWithId, baseEnum, IGame} from '@common'
import {Button, Input, List, Modal} from '@antd-component'
import {Link} from 'react-router-dom'
import {Title} from '@client-component'

const {TextArea} = Input, {Item: ListItem} = List, {Meta: ListItemMeta} = ListItem

interface IGameListState {
    showCreateModal: boolean
    gameList: Array<IGameWithId>
    newGame: IGame
}

export class GameList extends React.Component<RouteComponentProps<{}>, IGameListState> {
    lang = Lang.extractLang({
        createdGames: ['已创建实验', 'Created games'],
        create: ['创建', 'CREATE'],
        view: ['查看', 'VIEW'],
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        cancel: ['取消', 'Cancel'],
        submit: ['提交', 'Submit']
    })

    get defaultNewGame(): IGame {
        return {
            title: '',
            desc: ''
        }
    }

    state: IGameListState = {
        showCreateModal: false,
        gameList: [],
        newGame: this.defaultNewGame
    }

    async componentDidMount() {
        const {gameList} = await Api.getGameList()
        this.setState({gameList})
    }

    async cancelNewGame() {
        this.setState({
            showCreateModal: false,
            newGame: this.defaultNewGame
        })
    }

    async submitGame() {
        const {title, desc} = this.state.newGame
        const {code, gameId} = await Api.postNewGame(title, desc)
        if (code === baseEnum.ResponseCode.success) {
            this.setState(({gameList}) => ({
                showCreateModal: false,
                newGame: this.defaultNewGame,
                gameList: [...gameList, {id: gameId, title, desc}]
            }))
        }
    }

    render(): React.ReactNode {
        const {lang, state: {gameList}} = this
        return <section className={style.gameList}>
            <Title label={lang.createdGames}/>
            <List dataSource={gameList}
                  renderItem={game => <ListItem actions={[<Link to={`/game/info/${game.id}`}>{lang.view}</Link>]}>
                      <ListItemMeta title={game.title} description={game.desc}/>
                  </ListItem>}/>
            <div className={style.createBtnWrapper}>
                <Button type={'primary'} onClick={() => this.setState({showCreateModal: true})}>{lang.create}</Button>
            </div>
            {
                this.renderCreateModal()
            }
        </section>
    }

    renderCreateModal() {
        const {lang, state: {showCreateModal, newGame: {title, desc}}} = this
        return <Modal visible={showCreateModal}
                      cancelText={lang.cancel}
                      okText={lang.submit}
                      onCancel={() => this.cancelNewGame()}
                      onOk={() => this.submitGame()}>
            <br/>
            <Input value={title}
                   placeholder={lang.title}
                   maxLength={20}
                   onChange={({target: {value: title}}) => this.setState(({newGame}) => ({
                       newGame: {
                           ...newGame,
                           title
                       }
                   }))}/>
            <br/><br/>
            <TextArea value={desc}
                      maxLength={500}
                      autosize={{minRows: 5, maxRows: 10}}
                      placeholder={lang.desc}
                      onChange={({target: {value: desc}}) => this.setState(({newGame}) => ({
                          newGame: {
                              ...newGame,
                              desc
                          }
                      }))}/>
        </Modal>
    }
}