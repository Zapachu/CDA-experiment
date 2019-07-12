import {connCtx, Lang} from '@client-util'
import {playContext, rootContext, TPlayContext, TRootContext} from '@client-context'
import * as React from 'react'
import {PlayerStatus} from '@common'
import {Loading} from '@client-component'
import * as style from './style.scss'

@connCtx(rootContext)
@connCtx(playContext)
export class Play4Player extends React.Component<TRootContext & TPlayContext> {
    render(): React.ReactNode {
        const {props: {actor, gameState: {playerState, playUrl}}} = this
        switch (playerState[actor.token].status) {
            case PlayerStatus.playing: {
                return <iframe className={style.playIframe}
                               src={`${playUrl}?${Lang.key}=${Lang.activeLanguage}`}/>
            }
            case PlayerStatus.left: {
                return 'left'
            }
            default: {
                return <Loading/>
            }
        }
    }
}
