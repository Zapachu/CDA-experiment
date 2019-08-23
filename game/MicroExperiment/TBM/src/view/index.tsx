import {Core, registerOnFramework} from '@bespoke/client'
import * as React from 'react'
import {Play} from './Play'
import {DEFAULT_PARAMS, ICreateParams} from '../config'

function Create({setParams}: Core.ICreateProps<ICreateParams>) {
    React.useEffect(() => {
        setParams(DEFAULT_PARAMS)
    })
    return null
}

registerOnFramework('TBM', {
    localeNames: ['集合竞价', 'Together Bid Market'],
    Create,
    Play
})
