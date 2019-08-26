import * as React from 'react'
import * as style from './style.scss'
import {Button, Lang} from '@elf/component'
import {Core} from '@bespoke/client'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from '../config'

export function Play({game: {params}, gameState, playerState, frameEmitter}: Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    const lang = Lang.extractLang({
        click: ['点击', 'Click']
    })
    return <section className={style.play}>
        <Button label={lang.click} onClick={() => console.log(params, gameState, playerState, frameEmitter)}/>
    </section>
}