import express from 'express'

import controllers from './controllers'
const rootRouter = express.Router()

rootRouter.get('/', controllers.renderIndex)
rootRouter.get('/game/:type', controllers.renderGamePage)
export default rootRouter
