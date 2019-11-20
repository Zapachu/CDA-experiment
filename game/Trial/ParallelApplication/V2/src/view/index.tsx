import { registerOnFramework } from '@bespoke/client'
import { namespace } from '../config'
import * as React from 'react'
import { useEffect } from 'react'
import { loadScript } from '@elf/component'
import { CONST, TProps } from './Play/const'

function PlayStage() {
  useEffect(() => {
    loadScript(['https://cdnjs.cloudflare.com/ajax/libs/phaser/3.19.0/phaser.min.js'], () => require('./Play/index'))
  }, [])
  return (
    <div
      id={CONST.phaserParent}
      style={{
        fontFamily: 'raster',
        position: 'fixed',
        top: '0'
      }}
    />
  )
}

function ResultStage({ gameState, playerState }: TProps) {
  return <section>{JSON.stringify(gameState)}</section>
}

function Play(props: TProps) {
  const [playing, setPlaying] = React.useState(true)
  useEffect(() => {
    CONST.emitter = props.frameEmitter
    CONST.overCallBack = () => setPlaying(false)
  }, [])
  return playing ? <PlayStage /> : <ResultStage {...props} />
}

registerOnFramework(namespace, {
  Play
})
