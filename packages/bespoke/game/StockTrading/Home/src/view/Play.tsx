import * as React from 'react'
import {Core} from 'bespoke-client-util'
import {Header} from '../../../components'

type TProps = Core.IPlayProps<any, any, any, any, any, any, any, any>

export function Play({}: TProps) {
    return <Header stage={'home'}/>
}
