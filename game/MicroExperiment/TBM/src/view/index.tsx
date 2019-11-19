import { Core, registerOnFramework } from '@bespoke/client'
import * as React from 'react'
import { Play } from './Play'
import { NCreateParams } from '@micro-experiment/share'
import { ICreateParams } from '../config'

function Create({ setParams }: Core.ICreateProps<ICreateParams>) {
  React.useEffect(() => {
    setParams(NCreateParams.TBMDefaultParams)
  })
  return null
}

registerOnFramework('TBM', {
  localeNames: ['集合竞价', 'Together Bid Market'],
  Create,
  Play
})
