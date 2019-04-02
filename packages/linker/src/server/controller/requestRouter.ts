import {Router} from 'express'
import {config} from '@common'

import {UserCtrl, GameCtrl} from './requestHandler'

const {academus: {route: academusRoute}, apiPrefix} = config

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
    .use(`/${apiPrefix}`, apiRouter)
    .get(/baseInfo/, UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/createInFrame', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/configuration/:gameId', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/play/:gameId', UserCtrl.loggedIn, UserCtrl.isGameAccessible, UserCtrl.renderApp)
    .get('/share/:gameId', ({params: {gameId}}, res) => res.redirect(`${academusRoute.prefix}${academusRoute.share(gameId)}`))
    .get('/join', (req, res) => res.redirect(`${academusRoute.prefix}${academusRoute.join}`))
    .get('/*', UserCtrl.loggedIn, UserCtrl.renderApp)


