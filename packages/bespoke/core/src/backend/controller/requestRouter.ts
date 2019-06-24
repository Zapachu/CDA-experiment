import {Router} from 'express'
import {GameCtrl, UserCtrl} from './requestHandler'

const userApiRouter = Router()
    .get('/verifyCode', UserCtrl.getVerifyCode)
    .post('/login', UserCtrl.handleLogin)
    .get('/', UserCtrl.getUser)
    .post('/logout', UserCtrl.handleLogout)

const gameApiRouter = Router()
    .get('/historyThumb', GameCtrl.getHistoryGameThumbs)
    .post('/new', GameCtrl.newGame)
    .get('/share/:gameId', GameCtrl.shareGame)
    .post('/joinWithShareCode', GameCtrl.joinWithShareCode)
    .get('/simulatePlayer/:gameId', GameCtrl.getSimulatePlayers)
    .post('/simulatePlayer/:gameId', GameCtrl.newSimulatePlayer)
    .get('/moveLogs/:gameId', GameCtrl.getMoveLogs)
    .get('/:gameId', GameCtrl.getGame)

const apiRouter = Router()
    .use('/user', userApiRouter)
    .use('/game', gameApiRouter)

export const router = Router()
    .use('/api', apiRouter)
    .get('/*', UserCtrl.renderApp)