import {baseEnum, IPhaseConfig, config} from '@common'
import {UserDoc} from '@server-model'
import {Hash, redisClient, RedisKey} from '@server-util'
import {Request, Response, NextFunction} from 'express'
import {GameService, GroupService, PhaseService} from '@server-service'
import {WebpackHmr} from '../util/WebpackHmr'
import {PlayerService} from '../service/PlayerService'

const SECONDS_PER_DAY = 86400

export class UserCtrl {
    static async renderApp(req: Express.Request, res: Response, next: NextFunction) {
        WebpackHmr.sendIndexHtml(res, next)
    }

    static loggedIn(req, res: Response, next: NextFunction) {
        req.isAuthenticated() ? next() : res.redirect(config.academusLoginRoute)
    }

    static isTeacher(req, res: Response, next) {
        req.user.role === baseEnum.AcademusRole.teacher ? next() : res.redirect(config.academusLoginRoute)
    }

    static async isGroupAccessible(req, res: Response, next: NextFunction) {
        const {user: {_id}, params: {groupId}} = req,
            userId = _id.toString()
        const {owner} = await GroupService.getGroup(groupId)
        if (owner === userId) {
            return next()
        }
        const player = await PlayerService.findPlayerId(groupId, userId)
        if (player) {
            return next()
        }
        res.redirect(`/${config.rootName}/${config.appPrefix}/group/info/${groupId}`)
    }

    static getUser(req, res: Response) {
        if (!req.isAuthenticated()) {
            return res.json({
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
    static async getGame(req: Request, res) {
        const {params: {gameId}} = req
        const game = await GameService.getGame(gameId)
        res.json({
            code: baseEnum.ResponseCode.success,
            game
        })
    }

    static async getGameList(req, res) {
        const {user: {_id}} = req
        const gameList = await GameService.getGameList(_id.toString())
        res.json({
            code: baseEnum.ResponseCode.success,
            gameList
        })
    }

    static async saveNewGame(req, res) {
        const {body: {title, desc}, user: {_id}} = req
        const gameId = await GameService.saveGame(_id.toString(), title, desc)
        res.json({
            code: baseEnum.ResponseCode.success,
            gameId
        })
    }
}

export class GroupCtrl {
    static async getPhaseTemplates(req, res) {
        const user = req.user as UserDoc
        const templates = await PhaseService.getPhaseTemplates(user)
        res.json({
            code: baseEnum.ResponseCode.success,
            templates: templates.map(({namespace, jsUrl}) => ({namespace, jsUrl}))
        })
    }

    static async saveNewGroup(req: Request, res: Response) {
        const {params: {gameId}, body: {title, desc, phaseConfigs}, user: {id: owner}} = req
        const groupId = await GroupService.saveGroup({
            owner,
            gameId,
            title,
            desc,
            phaseConfigs: phaseConfigs.map(({key, namespace, title, param = {}, suffixPhaseKeys = []}: IPhaseConfig) => ({
                key, namespace, title, param, suffixPhaseKeys
            }))
        })
        res.json({
            code: baseEnum.ResponseCode.success,
            groupId
        })
    }

    static async getGroupList(req: Request, res: Response) {
        const {params: {gameId}} = req
        const groupList = await GameService.getGroupList(gameId)
        res.json({
            code: baseEnum.ResponseCode.success,
            groupList
        })
    }

    static async getBaseGroup(req: Request, res: Response) {
        const {groupId} = req.params
        const {phaseConfigs, ...group} = await GroupService.getGroup(groupId)
        res.json({
            code: baseEnum.ResponseCode.success,
            group
        })
    }

    static async getGroup(req: Request, res: Response) {
        const {groupId} = req.params
        const group = await GroupService.getGroup(groupId)
        res.json({
            code: baseEnum.ResponseCode.success,
            group
        })
    }

    static async shareGroup(req, res) {
        const {groupId} = req.params
        let shareCode = await redisClient.get(RedisKey.share_GroupCode(groupId))
        const {title} = await GroupService.getGroup(groupId)
        if (shareCode) {
            return res.json({
                code: baseEnum.ResponseCode.success,
                title,
                shareCode
            })
        }
        shareCode = Math.random().toString().substr(2, 6)
        try {
            await redisClient.setex(RedisKey.share_GroupCode(groupId), SECONDS_PER_DAY, shareCode)
            await redisClient.setex(RedisKey.share_CodeGroup(shareCode), SECONDS_PER_DAY, groupId)
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
        const groupId = await redisClient.get(RedisKey.share_CodeGroup(code))
        res.json(groupId ? {
            code: baseEnum.ResponseCode.success,
            groupId
        } : {
            code: baseEnum.ResponseCode.notFound
        })
    }

    static async joinGroup(req, res) {
        const {user: {_id}, params: {groupId}} = req, userId = _id.toString()
        try {
            const playerId = await PlayerService.findPlayerId(groupId, userId)
            if (!playerId) {
                await PlayerService.savePlayer(groupId, userId)
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

    static async getPlayers(req:Request, res:Response){
        const {params:{groupId}} = req
        try{
            const players = await PlayerService.getPlayers(groupId)
            res.json({
                code:baseEnum.ResponseCode.success,
                players
            })
        }catch (e) {
            res.json({
                code:baseEnum.ResponseCode.notFound
            })
        }
    } 

    static async getActor(req, res) {
        const {ResponseCode, Actor} = baseEnum
        let {user, params: {groupId}, query: {token: queryToken}} = req, userId = user._id.toString()
        const group = await GroupService.getGroup(groupId), playerId = await PlayerService.findPlayerId(groupId, userId)
        let token = Hash.isHash(queryToken) ? queryToken : userId === group.owner ? Hash.hashObj(userId) : Hash.hashObj(playerId)
        let type = token === Hash.hashObj(userId) ? Actor.owner : userId === group.owner ? Actor.clientRobot : Actor.player
        res.json({
            code: ResponseCode.success,
            group,
            actor: {token, type}
        })
    }
}