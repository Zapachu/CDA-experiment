import { config, IUserWithId } from 'linker-share'
import { IGameTemplate } from '@elf/client'

export { Api } from './Api'

export type TPageProps = {
  user: IUserWithId
}

export namespace GameTemplate {
  let gameTemplate: IGameTemplate

  export function setTemplate(template: IGameTemplate) {
    gameTemplate = template
  }

  export function getTemplate() {
    return gameTemplate
  }
}

export function toV5(route: string) {
  window.open(`${config.academus.route.prefix}${route}`, '_blank')
}
