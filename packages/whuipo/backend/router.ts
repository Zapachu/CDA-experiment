import {Router} from 'express'

import Controller from './controller'

const apiRouter = Router()
apiRouter.get('/initInfo', Controller.getInitInfo)
apiRouter.post('/login', Controller.login)
apiRouter.post('/asGuest', Controller.asGuest)

const rootRouter = Router()
rootRouter.use('/api', apiRouter)
rootRouter.get('/login', Controller.renderLogin)
rootRouter.get('/*', Controller.loggedIn, Controller.renderIndex)

export default rootRouter