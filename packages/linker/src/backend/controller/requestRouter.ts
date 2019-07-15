import {Router} from 'express'
import {config} from 'linker-share'

import {GameCtrl, UserCtrl} from './requestHandler'

const {apiPrefix} = config

const apiRouter = Router()
    .use('/user', Router()
        .get('/', UserCtrl.getUser)
    )
    .use('/game', Router()
        .get('/jsUrl/:namespace', GameCtrl.getJsUrl)
        .post('/create', GameCtrl.saveNewGame)
        .get('/list', GameCtrl.getGameList)
        .get('/actor/:gameId', GameCtrl.getActor)
        .get('/share/:gameId', GameCtrl.shareGame)
        .post('/joinWithShareCode', GameCtrl.joinWithShareCode)
        .post('/join/:gameId', GameCtrl.joinGame)
        .get('/baseInfo/:gameId', GameCtrl.getBaseGame)
        .get('/:gameId', GameCtrl.getGame)
    )

export default Router()
    .use(`/${apiPrefix}`, apiRouter)
    .get('/create/:namespace', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.isNamespaceAccessible, UserCtrl.renderApp)
    .get('/play/:gameId', UserCtrl.loggedIn, UserCtrl.mobileValid, UserCtrl.isGameAccessible, UserCtrl.renderApp)
    .get('/*', UserCtrl.loggedIn, UserCtrl.renderApp)

