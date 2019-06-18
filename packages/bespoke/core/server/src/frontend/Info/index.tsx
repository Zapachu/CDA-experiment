import * as React from 'react'
import * as style from './style.scss'
import {IGameWithId, IUserWithId} from 'bespoke-common'
import {Lang, Markdown, MaskLoading} from 'elf-component'
import {Api} from '../util'
import {RouteComponentProps} from 'react-router'

export function Info({history, match: {params: {gameId}}}: RouteComponentProps<{ gameId: string }>) {
    const lang = Lang.extractLang({
        enterRoom: ['进入实验', 'Enter Game'],
        joinGame: ['加入实验', 'Join Game']
    })
    const [game, setGame] = React.useState<IGameWithId<any>>(null),
        [user, setUser] = React.useState<IUserWithId>(null)
    React.useEffect(() => {
        Api.getGame(gameId).then(({game}) => setGame(game))
        Api.getUser().then(({user}) => setUser(user))
    }, [])
    if (!game || !user) {
        return <MaskLoading/>
    }
    return <div className={style.info}>
        <section className={style.desc}>
            <Markdown editable={false} value={game.desc}/>
        </section>
        <ul className={style.featureButtons}>
            <li {...{
                style: {
                    backgroundColor: '#ff888e'
                },
                onClick: () => history.push(`/play/${gameId}${location.search}`)
            }}>{game.owner === user.id ? lang.enterRoom : lang.joinGame}</li>
        </ul>
    </div>
}
