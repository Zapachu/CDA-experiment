import * as React from 'react'
import {IGameWithId, ResponseCode, TGameState, TPlayerState} from '@bespoke/share'
import {MaskLoading} from '@elf/component'
import {Core} from '@bespoke/client'
import {Api} from '../../util'
import {applyChange} from 'deep-diff'
import cloneDeep = require('lodash/cloneDeep')

declare type TTravelState = {
    token: string
    type: any
    params: any
    gameState: TGameState<any>,
    playerStates: { [token: string]: TPlayerState<any> }
}

declare interface IGameResultProps {
    game: IGameWithId<{}>
    Result4Owner: React.ComponentType<Core.IResult4OwnerProps<any,any,any,any,any>>
}

declare interface IGameResultState {
    loading: boolean
    travelStates: Array<TTravelState>
}

export class GameResult extends React.Component<IGameResultProps, IGameResultState> {
    state: IGameResultState = {
        loading: true,
        travelStates: []
    }

    componentDidMount(): void {
        Api.getMoveLogs(this.props.game.id).then(async ({code, moveLogs}) => {
            if (code !== ResponseCode.success) {
                return
            }
            const travelStates: Array<TTravelState> = []
            moveLogs.forEach(({token, type, params, gameState, playerStates, gameStateChanges, playerStatesChanges}, i) => {
                if (i === 0) {
                    travelStates[i] = {token, type, params, gameState, playerStates}
                    return
                }
                const state = cloneDeep(travelStates[i - 1]) as TTravelState
                gameStateChanges.forEach(change => applyChange(state.gameState, null, change))
                playerStatesChanges.forEach(change => applyChange(state.playerStates, null, change))
                travelStates[i] = {
                    token, type, params, gameState: state.gameState, playerStates: state.playerStates
                }
            })
            this.setState({
                loading: false,
                travelStates
            })
        })
    }

    render(): React.ReactNode {
        const {props: {game, Result4Owner}, state: {loading, travelStates}} = this
        if (loading) {
            return <MaskLoading/>
        }
        return <Result4Owner {...{game, travelStates}}/>
    }
}