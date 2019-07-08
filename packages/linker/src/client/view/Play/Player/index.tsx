import {connCtx} from "@client-util";
import {playContext, rootContext, TPlayContext, TRootContext} from "@client-context";
import * as React from "react";
import {CorePhaseNamespace, IPhaseState, PlayerStatus} from '@common'
import {Loading} from '@client-component'

@connCtx(rootContext)
@connCtx(playContext)
export class Play4Player extends React.Component<TRootContext & TPlayContext> {
    get curPhaseState(): IPhaseState {
        const {actor, gameState} = this.props
        let curPhaseState: IPhaseState = null
        gameState.phaseStates.forEach(phaseState => {
            if (phaseState.playerState[actor.token] !== undefined) {
                curPhaseState = phaseState
            }
        })
        return curPhaseState
    }

    render(): React.ReactNode {
        const {curPhaseState, props: {actor, game}} = this
        if (!curPhaseState) {
            return <Loading/>
        }
        const curPhaseCfg = game.phaseConfigs.find(({key}) => key === curPhaseState.key)
        if (curPhaseCfg.namespace === CorePhaseNamespace.end) {
            return <h2>GAME OVER</h2>
        }
        switch (curPhaseState.playerState[actor.token].status) {
            case PlayerStatus.playing: {
                window.location.href = curPhaseState.playUrl
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
