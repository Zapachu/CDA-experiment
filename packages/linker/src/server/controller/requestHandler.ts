import {baseEnum, config} from '@common'
import {UserDoc, PlayerModel} from '@server-model'
import {Hash, redisClient, RedisKey} from '@server-util'
import {Request, Response, NextFunction} from 'express'
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
        req.isAuthenticated() ? next() : res.redirect(config.academusLoginRoute)
    }

    static isTeacher(req, res: Response, next) {
        req.user.role === baseEnum.AcademusRole.teacher ? next() : res.redirect(`/${config.rootName}/join`)
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
                code: baseEnum.ResponseCode.notFound
            })
        }
        const {user: {_id, name, role, mobile, orgCode}} = req
        res.json({
            code: baseEnum.ResponseCode.success,
            user: {id: _id.toString(), name, role, mobile, orgCode}
        })
    }
}

export class GameCtrl {
    static async getPhaseTemplates(req, res) {
        const user = req.user as UserDoc
        const templates = await PhaseService.getPhaseTemplates(user)
        res.json({
            code: baseEnum.ResponseCode.success,
            templates: templates.map(({namespace, type, jsUrl}) => ({namespace, type, jsUrl}))
        })
    }

    static async saveNewGame(req: Request, res: Response) {
        const {body: {title, desc, mode, phaseConfigs}, user: {id: owner}} = req
        const gameId = await GameService.saveGame({
            owner,
            title,
            desc,
            mode,
            ...(phaseConfigs ? {phaseConfigs} : {})
        })
        res.json({
            code: baseEnum.ResponseCode.success,
            gameId
        })
    }

    static async updateGame(req: Request, res: Response) {
        const {params: {gameId}, body: {toUpdate}} = req
        const game = await GameService.updateGame(gameId, toUpdate)
        res.json({
            code: baseEnum.ResponseCode.success,
            game
        })
    }

    static async getGameList(req: Request, res: Response) {
        const {user: {_id}, query: {page = 0, pageSize = DEFAULT_PAGE_SIZE}} = req
        const {count, gameList} = await GameService.getGameList(_id, +page, +pageSize)
        res.json({
            code: baseEnum.ResponseCode.success,
            count,
            gameList
        })
    }

    static async getBaseGame(req: Request, res: Response) {
        const {gameId} = req.params
        const {phaseConfigs, ...game} = await GameService.getGame(gameId)
        res.json({
            code: baseEnum.ResponseCode.success,
            game
        })
    }

    static async getGame(req: Request, res: Response) {
        const {gameId} = req.params
        const game = await GameService.getGame(gameId)
        res.json({
            code: baseEnum.ResponseCode.success,
            game
        })
    }

    static async shareGame(req, res) {
        const {gameId} = req.params
        let shareCode = await redisClient.get(RedisKey.share_GroupCode(gameId))
        const {title} = await GameService.getGame(gameId)
        if (shareCode) {
            return res.json({
                code: baseEnum.ResponseCode.success,
                title,
                shareCode
            })
        }
        shareCode = Math.random().toString().substr(2, 6)
        try {
            await redisClient.setex(RedisKey.share_GroupCode(gameId), SECONDS_PER_DAY, shareCode)
            await redisClient.setex(RedisKey.share_CodeGroup(shareCode), SECONDS_PER_DAY, gameId)
            res.json({
                code: baseEnum.ResponseCode.success,
                title,
                shareCode
            })
        } catch (e) {
            res.js({
                code: baseEnum.ResponseCode.serverError
            })
        }
    }

    static async joinWithShareCode(req, res) {
        const {body: {code}} = req
        const gameId = await redisClient.get(RedisKey.share_CodeGroup(code))
        res.json(gameId ? {
            code: baseEnum.ResponseCode.success,
            gameId
        } : {
            code: baseEnum.ResponseCode.notFound
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
                code: baseEnum.ResponseCode.serverError
            })
        }
        return res.json({
            code: baseEnum.ResponseCode.success
        })
    }

    static async getPlayers(req: Request, res: Response) {
        const {params: {gameId}} = req
        try {
            const players = await PlayerService.getPlayers(gameId)
            res.json({
                code: baseEnum.ResponseCode.success,
                players
            })
        } catch (e) {
            res.json({
                code: baseEnum.ResponseCode.notFound
            })
        }
    }

    static async getRewardedMoney(req: Request, res: Response) {
        const {query: {playerId}} = req
        try {
            const {reward} = await PlayerModel.findById(playerId)
            res.json({
                code: baseEnum.ResponseCode.success,
                reward
            })
        } catch (e) {
            res.json({
                code: baseEnum.ResponseCode.notFound
            })
        }
    }

    static async getActor(req, res) {
        const {ResponseCode, Actor} = baseEnum
        let {user, params: {gameId}, query: {token: queryToken}} = req, userId = user._id.toString()
        const game = await GameService.getGame(gameId), playerId = await PlayerService.findPlayerId(gameId, userId)
        let token = Hash.isHash(queryToken) ? queryToken : userId === game.owner ? Hash.hashObj(userId) : Hash.hashObj(playerId)
        let type = token === Hash.hashObj(userId) ? Actor.owner : userId === game.owner ? Actor.clientRobot : Actor.player
        req.session.token = token
        req.session.playerId = playerId
        res.json({
            code: ResponseCode.success,
            game,
            actor: {token, type, playerId}
        })
    }
}
