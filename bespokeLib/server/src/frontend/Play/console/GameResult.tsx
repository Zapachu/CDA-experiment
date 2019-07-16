import * as React from 'react'
import {IGameWithId, ResponseCode} from '@bespoke/share'
import {MaskLoading} from '@elf/component'
import {Core} from '@bespoke/register'
import {Api} from '../../util'
import {applyChange} from 'deep-diff'
import cloneDeep = require('lodash/cloneDeep')

declare type TTravelState = Core.ITravelState<any, any, any, any>

declare interface IGameResultProps {
    game: IGameWithId<{}>
    Result4Owner: Core.Result4OwnerClass<any,any,any,any,any>
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