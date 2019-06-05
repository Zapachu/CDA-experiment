import {Router} from 'express'

import Controllers from './controller'

const {isLogined} = Controllers

const rootRouter = Router()
rootRouter.get('/', Controllers.renderIndex)

const apiRouter = Router()
apiRouter.use(isLogined)
apiRouter.get('/initInfo', Controllers.getInitInfo)

rootRouter.use('/api', apiRouter)

export default rootRouter