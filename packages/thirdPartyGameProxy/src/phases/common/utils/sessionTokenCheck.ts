import {Express, NextFunction, Request, Response} from 'express'
import {sendErrorPage} from './sendErrorPage'

const EXCLUDE = [
    'static',
    '/phases/list'
]

export function SessionTokenCheck(app: Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        const {originalUrl, user, session} = req
        if (EXCLUDE.some(route => originalUrl.includes(route))) {
            return next()
        }
        if (!user) {
            return sendErrorPage(res, 'Not Login')
        }
        if (!session.actor) {
            return sendErrorPage(res, 'Token Missing')
        }
        next()
    })
}