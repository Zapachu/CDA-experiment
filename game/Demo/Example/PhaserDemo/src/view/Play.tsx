import { useEffect } from 'react'
import { loadScript } from '@elf/component'
import { TProps } from './2048/const'

export function Play(props: TProps) {
  useEffect(() => {
    loadScript(['https://cdnjs.cloudflare.com/ajax/libs/phaser/3.19.0/phaser.min.js'], () => {
      require('./2048/const').CONST.props = props
      require('./2048')
    })
  }, [])
  return null
}
