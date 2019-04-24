import {useEffect} from 'react'
import {Core, loadThirdPartyLib, baseEnum} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType} from '../config'

type TProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>

export function Play(_props: TProps) {
    useEffect(() => {
        props = _props
        loadThirdPartyLib(baseEnum.ThirdPartyLib.phaser, () => require('./game'))
    }, [])
    return null
}

export let props: TProps
