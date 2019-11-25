import { registerOnFramework } from '@bespoke/client'
import { namespace } from '../config'
import React from 'react'
import { loadScript } from '@elf/component'
import { CONST, TProps } from './Play/const'

function Play(props: TProps) {
  React.useEffect(() => {
    CONST.emitter = props.frameEmitter
    loadScript(['https://cdnjs.cloudflare.com/ajax/libs/phaser/3.19.0/phaser.min.js'], () => require('./Play/index'))
  }, [])
  return (
    <div
      id={CONST.phaserParent}
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
