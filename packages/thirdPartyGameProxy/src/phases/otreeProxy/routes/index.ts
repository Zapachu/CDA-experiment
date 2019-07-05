import {Router} from 'express'
import {Ctrl} from '../controllers'
import {hasServer} from '../controllers'

const router = Router()
// proxy
    .use('/', Router()
        .get('/otree/init/:id', hasServer, Ctrl.proxyServer)
        .all('/*', Ctrl.proxyOther)
    )

export {
    router
}
