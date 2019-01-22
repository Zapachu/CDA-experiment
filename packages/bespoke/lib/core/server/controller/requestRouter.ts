import {Router} from 'express'
import {GameCtrl, UserCtrl} from './requestHandler'

//region /api/user
const userApiRouter = Router()
userApiRouter.get('/verifyCode', UserCtrl.getVerifyCode)
userApiRouter.post('/login', UserCtrl.handleLogin)
userApiRouter.get('/', UserCtrl.getUser)
userApiRouter.post('/logout', UserCtrl.handleLogout)
//endregion

//region /api/game
const gameApiRouter = Router()
gameApiRouter.get('/accessibleTemplates', GameCtrl.getAccessibleTemplates)
gameApiRouter.get('/gameTemplateUrl/:namespace', GameCtrl.getGameTemplateUrl)
gameApiRouter.get('/historyThumb', GameCtrl.getHistoryGameThumbs)
gameApiRouter.post('/new', GameCtrl.newGame)
gameApiRouter.get('/:gameId', GameCtrl.getGame)
gameApiRouter.get('/share/:gameId', GameCtrl.shareGame)
gameApiRouter.post('/joinWithShareCode', GameCtrl.joinWithShareCode)
gameApiRouter.get('/simulatePlayer/:gameId', GameCtrl.getSimulatePlayers)
gameApiRouter.post('/simulatePlayer/:gameId', GameCtrl.newSimulatePlayer)
gameApiRouter.get('/actor/:gameId', GameCtrl.getActor)
gameApiRouter.get('/moveLogs/:gameId', GameCtrl.getMoveLogs)
gameApiRouter.all('/pass2Game/:gameId', GameCtrl.passThrough)
    .all('/pass2Namespace/:namespace', GameCtrl.passThrough)
//endregion

//region /api
const apiRouter = Router()
apiRouter.use('/user', userApiRouter)
apiRouter.use('/game', gameApiRouter)
//endregion

//region /
const router = Router()
router.use('/api', apiRouter)
router.get('/dashboard', UserCtrl.isTeacher, UserCtrl.renderApp)
router.get('/create/:namespace', UserCtrl.isTeacher, UserCtrl.renderApp)
router.get('/*', UserCtrl.renderApp)
//endregion

export default router
