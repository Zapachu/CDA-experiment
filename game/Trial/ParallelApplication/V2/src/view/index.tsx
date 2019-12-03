import { registerOnFramework } from '@bespoke/client'
import { namespace } from '../config'
import React from 'react'
import { loadScript } from '@elf/component'
import { Bridge, PHASER_PARENT_ID, TProps } from './Play/const'

function Play(props: TProps) {
  React.useEffect(() => {
    Bridge.emitter = props.frameEmitter
    loadScript(['https://cdnjs.cloudflare.com/ajax/libs/phaser/3.19.0/phaser.min.js'], () => require('./Play/index'))
  }, [])
  Bridge.props = props
  return (
    <div
      id={PHASER_PARENT_ID}
      style={{
        position: 'fixed',
        top: '0'
      }}
    />
  )
}

registerOnFramework(namespace, {
  Play
})
