import {config, IActor} from '@common'
import {redisClient, RedisKey} from '@server-util'
import {NextFunction, Request, Response} from 'express'
import {Token} from '@elf/util'
import {AcademusRole, Actor, ResponseCode} from '@elf/share'
import {GameService, PhaseService} from '@server-service'
import {WebpackHmr} from '../util/WebpackHmr'
import {PlayerService} from '../service/PlayerService'

const SECONDS_PER_DAY = 86400
const DEFAULT_PAGE_SIZE = 11

export class UserCtrl {
    static async renderApp(req: Request, res: Response, next: NextFunction) {
        WebpackHmr.sendIndexHtml(res, next)
    }

    static loggedIn(req, res: Response, next: NextFunction) {
        const {prefix, login} = config.academus.route
        req.isAuthenticated() ? next() : res.redirect(`${prefix}${login}`)
    }

    static isTeacher(req, res: Response, next) {
        req.user.role === AcademusRole.teacher ? next() : res.redirect(`/${config.rootName}/join`)
    }

    static async isTemplateAccessible(req, res: Response, next) {
        const templates = await PhaseService.getPhaseTemplates(req.user._id.toString())
        templates.some(({namespace}) => namespace === req.params.namespace) ? next() : res.redirect(`/${config.rootName}`)
    }

    static async isGameAccessible(req, res: Response, next: NextFunction) {
        const {user: {_id}, params: {gameId}} = req,
            userId = _id.toString()
        const {owner} = await GameService.getGame(gameId)
        if (owner === userId) {
            return next()
        }
        const player = await PlayerService.findPlayerId(gameId, userId)
        console.log(player)
        if (player) {
            return next()
        }
        res.redirect(`/${config.rootName}/info/${gameId}`)
    }

    static getUser(req, res: Response) {
        if (!req.isAuthenticated()) {
            res.json({
                code: ResponseCode.notFound
            })
        }
        const {user: {_id, name, role, mobile, orgCode}} = req
        res.json({
            code: ResponseCode.success,
            user: {id: _id.toString(), name, role, mobile, orgCode}
        })
    }
}

export class GameCtrl {
    static async getPhaseTemplates(req, res: Response) {
        const templates = await PhaseService.getPhaseTemplates(req.user._id.toString())
        res.json({
            code: ResponseCode.success,
            templates
        })
    }

    static async saveNewGame(req: Request, res: Response) {
        const {body: {title, desc, namespace, param}, user: {id: owner, orgCode}, session} = req
        const gameId = await GameService.saveGame({
            owner,
            orgCode: session.orgCode || orgCode,
            title,
            desc,
            namespace,
            param
        })
        res.json({
            code: ResponseCode.success,
            gameId
        })
    }

    static async getGameList(req: Request, res: Response) {
        const {user: {_id}, query: {page = 0, pageSize = DEFAULT_PAGE_SIZE}} = req
        const {count, gameList} = await GameService.getGameList(_id, +page, +pageSize)
        res.json({
            code: ResponseCode.success,
            count,
            gameList
        })
    }

    static async getBaseGame(req: Request, res: Response) {
        const {gameId} = req.params
        const {param, ...game} = await GameService.getGame(gameId)
        res.json({
            code: ResponseCode.success,
            game
        })
    }

    static async getGame(req: Request, res: Response) {
        const {gameId} = req.params
        const game = await GameService.getGame(gameId)
        res.json({
            code: ResponseCode.success,
            game
        })
    }

    static async shareGame(req, res) {
        const {gameId} = req.params
        let shareCode = await redisClient.get(RedisKey.share_GameCode(gameId))
        const {title} = await GameService.getGame(gameId)
        if (shareCode) {
            return res.json({
                code: ResponseCode.success,
                title,
                shareCode
            })
        }
        shareCode = Math.random().toString().substr(2, 6)
        try {
            await redisClient.setex(RedisKey.share_GameCode(gameId), SECONDS_PER_DAY, shareCode)
            await redisClient.setex(RedisKey.share_CodeGame(shareCode), SECONDS_PER_DAY, gameId)
            res.json({
                code: ResponseCode.success,
                title,
                shareCode
            })
        } catch (e) {
            res.js({
                code: ResponseCode.serverError
            })
        }
    }

    static async joinWithShareCode(req, res) {
        const {body: {code}} = req
        const gameId = await redisClient.get(RedisKey.share_CodeGame(code))
        res.json(gameId ? {
            code: ResponseCode.success,
            gameId
        } : {
            code: ResponseCode.notFound
        })
    }

    static async joinGame(req, res) {
        const {user: {_id}, params: {gameId}} = req, userId = _id.toString()
        try {
            const playerId = await PlayerService.findPlayerId(gameId, userId)
            if (!playerId) {
                await PlayerService.savePlayer(gameId, userId)
            }
        } catch (e) {
            return res.json({
                code: ResponseCode.serverError
            })
        }
        return res.json({
            code: ResponseCode.success
        })
    }

    static async getActor(req, res) {
        const {user, params: {gameId}} = req, userId = user._id.toString()
        const game = await GameService.getGame(gameId), playerId = await PlayerService.findPlayerId(gameId, userId)
        const token = Token.geneToken(userId === game.owner ? userId : playerId),
            type = userId === game.owner ? Actor.owner : Actor.player
        req.session.actor = {
            token,
            type
        } as IActor
        res.json({
            code: ResponseCode.success,
            game,
            actor: {token, type, playerId}
        })
    }
}
