import {connCtx} from '@client-util'
import {playContext, rootContext, TPlayContext, TRootContext} from '@client-context'
import * as React from 'react'
import {PlayerStatus} from '@common'
import {Loading} from '@client-component'

@connCtx(rootContext)
@connCtx(playContext)
export class Play4Player extends React.Component<TRootContext & TPlayContext> {
    render(): React.ReactNode {
        const {props: {actor, gameState: {playerState, playUrl}}} = this
        switch (playerState[actor.token].status) {
            case PlayerStatus.playing: {
                window.location.href = playUrl
                return null
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
