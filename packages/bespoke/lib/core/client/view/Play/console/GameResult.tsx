import * as React from 'react'
import {baseEnum, IGameWithId} from '@common'
import {Core, Api, Fetcher, MaskLoading} from 'client-vendor'
import cloneDeep = require('lodash/cloneDeep')
import {applyChange} from 'deep-diff'

declare type TTravelState = Core.ITravelState<any, any, any, any>

declare interface IGameResultProps {
    game: IGameWithId<{}>
    fetcher: Fetcher<any>
    Result4Owner: Core.Result4OwnerClass
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
            if (code !== baseEnum.ResponseCode.success) {
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
        const {props: {game, fetcher, Result4Owner}, state: {loading, travelStates}} = this
        if (loading) {
            return <MaskLoading/>
        }
        return <Result4Owner {...{fetcher, game, travelStates}}/>
    }
}