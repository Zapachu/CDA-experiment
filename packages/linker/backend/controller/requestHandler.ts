import {config, IActor} from 'linker-share';
import * as path from 'path';
import {RedisKey} from '../util';
import {NextFunction, Request, Response} from 'express';
import {Token} from '@elf/util';
import {redisClient} from '@elf/protocol';
import {AcademusRole, Actor, historyGamesListSize, IGameThumb, ResponseCode} from '@elf/share';
import {GameService, PlayerService} from '../service';
import {GameModel} from '../model';

const SECONDS_PER_DAY = 86400
const DEFAULT_PAGE_SIZE = 11

export class UserCtrl {
    static async renderApp(req: Request, res: Response) {
        res.sendFile(path.resolve(__dirname, '../../dist/index.html'))
    }

    static loggedIn(req, res: Response, next: NextFunction) {
        const {prefix, login} = config.academus.route
        req.isAuthenticated() ? next() : res.redirect(`${prefix}${login}`)
    }

    static mobileValid(req, res: Response, next) {
        const {prefix, profileMobile} = config.academus.route
        const {mobile} = req.user
        mobile && !mobile.startsWith('null') ? next() : res.redirect(`${prefix}${profileMobile}`)
    }

    static isTeacher(req, res: Response, next) {
        req.user.role === AcademusRole.teacher ? next() : res.redirect(`/${config.rootName}/join`)
    }

    static async isNamespaceAccessible(req, res: Response, next) {
        const gameServers = await GameService.getHeartBeats(req.user._id.toString())
        gameServers.some(({namespace}) => namespace === req.params.namespace) ? next() : res.redirect(`/${config.rootName}`)
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
    static async getJsUrl(req: Request, res: Response) {
        const {params:{namespace}} = req
        const heartBeat = (await GameService.getHeartBeats()).find(s=>s.namespace === namespace)
        res.json(heartBeat?{
            code: ResponseCode.success,
            jsUrl: heartBeat.jsUrl
        }:{
            code: ResponseCode.notFound
        })
    }

    static async saveNewGame(req, res: Response) {
        const {body: {title, desc, namespace, params}, user: {id: owner, orgCode}, session} = req
        const gameId = await GameService.saveGame({
            owner,
            orgCode: session.orgCode || orgCode,
            title,
            desc,
            namespace,
            params
        })
        res.json({
            code: ResponseCode.success,
            gameId
        })
    }

    static async getGameList(req, res: Response) {
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
        const {params, ...game} = await GameService.getGame(gameId)
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

    static async getHistoryGameThumbs(req, res) {
        const {user, params:{namespace}} = req
        console.log(namespace)
        try {
            const historyGameThumbs: Array<IGameThumb> = (await GameModel.find({
                owner: user.id,
                namespace: namespace
            })
                .limit(historyGamesListSize)
                .sort({createAt: -1})).map(({id, namespace, title, createAt}) => ({id, namespace, title, createAt}))
            res.json({
                code: ResponseCode.success,
                historyGameThumbs
            })
        } catch (err) {
            res.json({
                code: ResponseCode.serverError
            })
        }
    }
}
