import { Router } from 'express'
import { config } from 'linker-share'

import { GameCtrl, UserCtrl } from './requestHandler'

const { apiPrefix } = config

const apiRouter = Router()
  .use('/user', Router().get('/', UserCtrl.getUser))
  .use(
    '/game',
    Router()
      .get('/historyThumb/:namespace', GameCtrl.getHistoryGameThumbs)
      .get('/jsUrl/:namespace', GameCtrl.getJsUrl)
      .post('/create', GameCtrl.saveNewGame)
      .get('/actor/:gameId', GameCtrl.getActor)
      .post('/join/:gameId', GameCtrl.joinGame)
      .get('/baseInfo/:gameId', GameCtrl.getBaseGame)
      .get('/:gameId', GameCtrl.getGame)
  )

export default Router()
  .use(`/${apiPrefix}`, apiRouter)
  .get('/create/:namespace', UserCtrl.loggedIn, UserCtrl.isTeacher, UserCtrl.isNamespaceAccessible, UserCtrl.renderApp)
  .get('/play/:gameId', UserCtrl.loggedIn, UserCtrl.mobileValid, UserCtrl.isGameAccessible, UserCtrl.renderApp)
  .get('/*', UserCtrl.loggedIn, UserCtrl.renderApp)
