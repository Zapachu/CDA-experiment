import * as React from 'react'
import * as style from './style.scss'
import {Label, Input, Markdown, Lang} from 'client-vendor'
import {IGameConfig} from '@common'

declare interface IGameInfoProps {
    title: string,
    desc: string,
    updateGameInfo: (gameCfgPartial: Partial<IGameConfig<any>>) => void
}

export const GameInfo: React.SFC<IGameInfoProps> = ({title, desc, updateGameInfo}) => {
    const lang = Lang.extractLang({
        GameTitle: ['实验标题', 'Title'],
        GameDesc: ['实验详情', 'Description']
    })

    return <section className={style.gameInfo}>
        <div className={style.gameFieldWrapper}>
            <Input value={title} placeholder={lang.GameTitle}
                   onChange={({target: {value: title}}) => updateGameInfo({title})}/>
        </div>
        <div className={style.gameFieldWrapper}>
            <Label label={lang.GameDesc}/>
            <Markdown editable={true} value={desc}
                      onChange={({target: {value: desc}}) => updateGameInfo({desc})}/>
        </div>
    </section>
}