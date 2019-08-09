import {Router} from 'express'

import Controllers from './controller'

const {isLogined} = Controllers

const rootRouter = Router()
rootRouter.get('/', isLogined, Controllers.renderIndex)
rootRouter.get('/signIn', Controllers.renderSignIn)
rootRouter.get('/login', Controllers.login)

const apiRouter = Router()
apiRouter.get('/initInfo', Controllers.getInitInfo)
rootRouter.use('/api', isLogined, apiRouter)

export default rootRouter