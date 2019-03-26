import {Router} from 'express'
import {GameCtrl, UserCtrl} from './requestHandler'

const userApiRouter = Router()
    .get('/verifyCode', UserCtrl.getVerifyCode)
    .post('/login', UserCtrl.handleLogin)
    .get('/', UserCtrl.getUser)
    .post('/logout', UserCtrl.handleLogout)

const gameApiRouter = Router()
    .get('/accessibleTemplates', GameCtrl.getAccessibleTemplates)
    .get('/historyThumb', GameCtrl.getHistoryGameThumbs)
    .post('/new', GameCtrl.newGame)
    .get('/namespace/:gameId', GameCtrl.getNamespace)
    .get('/share/:gameId', GameCtrl.shareGame)
    .post('/joinWithShareCode', GameCtrl.joinWithShareCode)
    .get('/simulatePlayer/:gameId', GameCtrl.getSimulatePlayers)
    .post('/simulatePlayer/:gameId', GameCtrl.newSimulatePlayer)
    .get('/actor/:gameId', GameCtrl.getActor)
    .get('/moveLogs/:gameId', GameCtrl.getMoveLogs)
const apiRouter = Router()
    .use('/user', userApiRouter)
    .use('/game', gameApiRouter)

export const rootRouter = Router()
    .use('/api', apiRouter)
    .get('/dashboard', UserCtrl.isTeacher, UserCtrl.renderApp)
    .get('/*', UserCtrl.renderApp)

const namespaceApiRouter = Router()
    .get('/game/:gameId', GameCtrl.getGame)
    .all('/pass2Game/:gameId', GameCtrl.passThrough)
    .all('/pass2Namespace', GameCtrl.passThrough)
export const namespaceRouter = Router()
    .use(`/api`, namespaceApiRouter)
    .get('/create', UserCtrl.isTeacher, UserCtrl.renderApp)