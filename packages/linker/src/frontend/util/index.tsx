import {config, IUserWithId} from 'linker-share'
import {RouteComponentProps} from 'react-router-dom'
import {IGameTemplate} from '@elf/client'

export {Api} from './Api'
export {loadScript} from './fileLoader'

export type TPageProps = Partial<{
    user: IUserWithId
} & RouteComponentProps<{ gameId?: string }>>

export namespace GameTemplate {
    let gameTemplate: IGameTemplate

    export function setTemplate(template: IGameTemplate) {
        gameTemplate = template
    }

    export function getTemplate() {
        return gameTemplate
    }

}

export function toV5(route:string) {
    window.open(`${config.academus.route.prefix}${route}`, '_blank')
}