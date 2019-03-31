import {Router} from 'express'
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
        .get('/rewarded', GameCtrl.getRewardedMoney)
        .get('/playerResult', GameCtrl.getPlayerResult)
        .get('/:gameId', GameCtrl.getGame)
    )

export default Router()
    .use(`/${config.apiPrefix}`, apiRouter)
    .get('/login', UserCtrl.renderApp)
    .get(/baseInfo/, UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/createInFrame', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/configuration/:gameId', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/play/:gameId', UserCtrl.loggedIn, UserCtrl.isGameAccessible, UserCtrl.renderApp)
    .get('/*', UserCtrl.loggedIn, UserCtrl.renderApp)


