import {Router} from 'express'

import Controllers from './controller'

const {isLogined} = Controllers

const rootRouter = Router()
rootRouter.use(isLogined)
rootRouter.get('/', Controllers.renderIndex)

export default rootRouter