import {Router, Response} from 'express'
import {config} from '@common'

import {UserCtrl, GameCtrl, GroupCtrl} from './requestHandler'

const apiRouter = Router()
    .use('/user', Router()
        .get('/', UserCtrl.getUser)
    )
    .use('/game', Router()
        .get('/list', GameCtrl.getGameList)
        .post('/create', GameCtrl.saveNewGame)
        .get('/:gameId', GameCtrl.getGame)
    )
    .use('/group', Router()
        .get('/phaseTemplates', GroupCtrl.getPhaseTemplates)
        .post('/create/:gameId', GroupCtrl.saveNewGroup)
        .get('/list/:gameId', GroupCtrl.getGroupList)
        .get('/actor/:groupId', GroupCtrl.getActor)
        .get('/share/:groupId', GroupCtrl.shareGroup)
        .post('/joinWithShareCode', GroupCtrl.joinWithShareCode)
        .post('/join/:groupId', GroupCtrl.joinGroup)
        .get('/baseInfo/:groupId', GroupCtrl.getBaseGroup)
        .get('/getPlayers/:groupId', GroupCtrl.getPlayers)
        .get('/:groupId', GroupCtrl.getGroup)
    )

const appRouter = Router()
    .get('/login', UserCtrl.renderApp)
    .get('/game/create', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/group/create', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/group/play/:groupId', UserCtrl.loggedIn, UserCtrl.isGroupAccessible, UserCtrl.renderApp)
    .get('/*', UserCtrl.loggedIn, UserCtrl.renderApp)

export default Router()
    .use(`/${config.apiPrefix}`, apiRouter)
    .use(`/${config.appPrefix}`, appRouter)
    .use('/*', (req, res:Response)=>res.redirect('/'))



