import {Router, Response} from 'express'
import {config} from '@common'

import {UserCtrl, GameCtrl} from './requestHandler'

const apiRouter = Router()
    .use('/user', Router()
        .get('/', UserCtrl.getUser)
    )
    .use('/game', Router()
        .get('/phaseTemplates', GameCtrl.getPhaseTemplates)
        .post('/create', GameCtrl.saveNewGame)
        .post('/edit/:gameId', GameCtrl.updateGame)
        .get('/list', GameCtrl.getGameList)
        .get('/actor/:gameId', GameCtrl.getActor)
        .get('/share/:gameId', GameCtrl.shareGame)
        .post('/joinWithShareCode', GameCtrl.joinWithShareCode)
        .post('/join/:gameId', GameCtrl.joinGame)
        .get('/baseInfo/:gameId', GameCtrl.getBaseGame)
        .get('/getPlayers/:gameId', GameCtrl.getPlayers)
        .get('/:gameId', GameCtrl.getGame)
    )

const appRouter = Router()
    .get('/login', UserCtrl.renderApp)
    .get('/game/create', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/group/create', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/group/play/:gameId', UserCtrl.loggedIn, UserCtrl.isGameAccessible, UserCtrl.renderApp)
    .get('/*', UserCtrl.loggedIn, UserCtrl.renderApp)

export default Router()
    .use(`/${config.apiPrefix}`, apiRouter)
    .use(`/${config.appPrefix}`, appRouter)
    .use('/*', (req, res:Response)=>res.redirect('/'))



