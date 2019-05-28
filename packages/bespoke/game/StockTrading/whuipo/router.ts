import {Router} from 'express'

import Controllers from './controller'

const {isLogined} = Controllers

const rootRouter = Router()
rootRouter.use(isLogined)
rootRouter.get('/', Controllers.renderIndex)

const apiRouter = Router()
apiRouter.get('/initInfo', Controllers.getInitInfo)
rootRouter.use('/api', apiRouter)

export default rootRouter