import * as React from 'react'
import * as style from './style.scss'
import {baseEnum, IGameThumb} from 'bespoke-core-share'
import {Button, Lang, TPageProps} from 'elf-component'
import {Api} from '../util'
import * as dateFormat from 'dateformat'

export function Dashboard({history, user}: TPageProps) {
    const lang = Lang.extractLang({
        createGame: ['创建实验', 'Create Game'],
        historyGame: ['历史实验', 'History Game']
    })
    const [historyGameThumbs, setHistoryGameThumbs] = React.useState<Array<IGameThumb>>([])
    React.useEffect(() => {
        if (user && user.role === baseEnum.AcademusRole.teacher) {
            Api.getHistoryGames().then(({code, historyGameThumbs}) => code === baseEnum.ResponseCode.success ? setHistoryGameThumbs(historyGameThumbs) : null)
        } else {
            history.push('/join')
        }
    }, [])
    return <section className={style.dashboard}>
        <div className={style.createBtnWrapper}>
            <Button onClick={() => history.push('/create')} label={lang.createGame}/>
        </div>
        <label className={style.title}>{lang.historyGame}</label>
        <ul className={style.historyGames}>
            {
                historyGameThumbs.map(({id, title, createAt}) =>
                    <li key={id}
                        onClick={() => history.push(`/play/${id}`)}
                    >
                        {title}
                        <span className={style.timestamp}>{dateFormat(createAt, 'yyyy-mm-dd')}</span>
                    </li>)
            }
        </ul>
    </section>
}