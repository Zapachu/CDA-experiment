import {connCtx} from "@client-util";
import {playContext, rootContext, TPlayContext, TRootContext} from "@client-context";
import * as React from "react";
import {baseEnum, CorePhaseNamespace, IPhaseState} from '@common'
import {Loading} from '@client-component'

@connCtx(rootContext)
@connCtx(playContext)
export class Play4Player extends React.Component<TRootContext & TPlayContext> {
    get curPhaseState(): IPhaseState {
        const {actor, groupState} = this.props
        let curPhaseState: IPhaseState = null
        groupState.phaseStates.forEach(phaseState => {
            if (phaseState.playerStatus[actor.token] !== undefined) {
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
        switch (curPhaseState.playerStatus[actor.token]) {
            case baseEnum.PlayerStatus.playing: {
                window.location.href = `${curPhaseState.playUrl}?token=${actor.token}`
                return null
            }
            case baseEnum.PlayerStatus.left: {
                return 'left'
            }
            default: {
                return <Loading/>
            }
        }
    }
}