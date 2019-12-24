import { config, IUserWithId } from 'linker-share'
import { IGameTemplate } from '@elf/client'

export { Frame } from './Frame'
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

export enum V5Route {
  item,
  push,
  share,
  member,
  transaction
}

export function toV5(route: V5Route, orgCode?: string, gameId?: string) {
  let routePath = ''
  switch (route) {
    case V5Route.item:
      routePath = `/org/${orgCode}/task/game/item/${gameId}`
      break
    case V5Route.share:
      routePath = `/org/${orgCode}/task/game/item/${gameId}`
      break
    case V5Route.push:
      routePath = `/org/${orgCode}/task/game/push/${gameId}`
      break
    case V5Route.member:
      routePath = `/org/${orgCode}/task/game/item/${gameId}/members`
      break
    case V5Route.transaction:
      routePath = `/org/${orgCode}/task/game/trans/${gameId}`
      break
  }
  window.open(`${config.academus.route.prefix}${routePath}`, '_blank')
}
