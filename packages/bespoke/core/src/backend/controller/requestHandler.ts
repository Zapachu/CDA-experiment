import {baseEnum, IGameThumb} from 'bespoke-core-share'
import {redisClient} from 'elf-protocol'
import {Request, Response} from 'express'
import * as passport from 'passport'
import {elfSetting} from 'elf-setting'
import {Log} from 'bespoke-server-util'
import {CONFIG, RedisKey, Setting, Token} from '../util'
import {PassportStrategy} from '../interface'
import {GameModel, MoveLogModel, SimulatePlayerModel, UserDoc, UserModel} from '../model'
import {GameDAO, GameLogic, UserService} from '../service'
import * as fs from 'fs'
import * as path from 'path'

export class UserCtrl {
    static async renderApp(req, res: Response) {
        const chunk = fs.readFileSync(path.resolve(__dirname, `../../../dist/index.html`)).toString()
        res.set('content-type', 'text/html')
        res.end(`<script type="text/javascript">
Object.assign(window, {
    NAMESPACE:'${Setting.namespace}',
    WITH_LINKER:${elfSetting.bespokeWithLinker},
    PRODUCT_ENV:${elfSetting.inProductEnv}
})
</script>` +
            chunk.replace(/static/g, `${Setting.namespace}/static`) +
            `<script type="text/javascript" src="${Setting.getClientPath()}"></script>`)
    }

    static async getVerifyCode(req, res) {
        const {query: {nationCode, mobile}} = req
        const sendResult = await UserService.sendVerifyCode(+nationCode, mobile)
        switch (sendResult.code) {
            case UserService.sendVerifyCodeResCode.tooManyTimes:
            case UserService.sendVerifyCodeResCode.countingDown: {
                res.json({
                    code: baseEnum.ResponseCode.invalidInput,
                    msg: sendResult.msg
                })
                break
            }
            case UserService.sendVerifyCodeResCode.sendError: {
                res.json({
                    code: baseEnum.ResponseCode.serverError
                })
                break
            }
            case UserService.sendVerifyCodeResCode.success: {
                res.json({
                    code: baseEnum.ResponseCode.success
                })
            }
        }
    }

    static async handleLogin(req, res: Response, next) {
        const {body: {nationCode, mobile, verifyCode}, session: {returnToUrl}} = req
        const _verifyCode = await redisClient.get(RedisKey.verifyCode(nationCode, mobile))
        if (elfSetting.inProductEnv && verifyCode !== _verifyCode) {
            return res.json({
                code: baseEnum.ResponseCode.notFound
            })
        }
        let user = await UserModel.findOne({mobile})
        if (!user) {
            await new UserModel({
                mobile,
                role: baseEnum.AcademusRole.teacher
            }).save()
        }
        passport.authenticate(PassportStrategy.local, function (err, user) {
            if (err || !user) {
                res.json({
                    code: baseEnum.ResponseCode.notFound
                })
            }
            req.logIn(user, err => {
                res.json(err ? {
                    code: baseEnum.ResponseCode.notFound
                } : {
                    code: baseEnum.ResponseCode.success,
                    returnToUrl
                })
            })
        })(req, res, next)
    }

    static async handleLogout(req: Express.Request, res: Response) {
        req.logOut()
        res.json({
            code: baseEnum.ResponseCode.success
        })
    }

    static getUser(req, res: Response) {
        if (!req.user) {
            return res.json({
                code: baseEnum.ResponseCode.notFound
            })
        }
        const {id, mobile, role} = req.user as UserDoc
        res.json({
            code: baseEnum.ResponseCode.success,
            user: {id, mobile, role}
        })
    }
}

export class GameCtrl {
    static async getGame(req, res) {
        const {user, params: {gameId}} = req
        try {
            let game = await GameDAO.getGame(gameId)
            if (!user || user._id.toString() !== game.owner) {
                game = (await GameLogic.getGameController(gameId)).getGame4Player()
            }
            res.json({
                code: baseEnum.ResponseCode.success,
                game
            })
        } catch (e) {
            Log.e(e)
            res.json({
                code: baseEnum.ResponseCode.notFound
            })
        }
    }

    static async newGame(req, res) {
        const {game} = req.body, owner = req.user
        const gameId = await GameDAO.newGame(owner, game)
        res.json(gameId ? {
            code: baseEnum.ResponseCode.success,
            gameId
        } : {
            code: baseEnum.ResponseCode.serverError
        })
    }

    static async shareGame(req, res) {
        const {gameId} = req.params
        let shareCode = await redisClient.get(RedisKey.share_GameCode(gameId))
        const {title} = await GameDAO.getGame(gameId)
        if (shareCode) {
            return res.json({
                code: baseEnum.ResponseCode.success,
                title,
                shareCode
            })
        }
        shareCode = Math.random().toString().substr(2, 6)
        try {
            await redisClient.setex(RedisKey.share_GameCode(gameId), CONFIG.shareCodeLifeTime, shareCode)
            await redisClient.setex(RedisKey.share_CodeGame(shareCode), CONFIG.shareCodeLifeTime, gameId)
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
        const gameId = await redisClient.get(RedisKey.share_CodeGame(code))
        res.json(gameId ? {
            code: baseEnum.ResponseCode.success,
            gameId
        } : {
            code: baseEnum.ResponseCode.notFound
        })
    }

    static async getSimulatePlayers(req: Request, res) {
        const {params: {gameId}} = req
        const simulatePlayers = (await SimulatePlayerModel.find({gameId}))
            .map(({gameId, token, name}) => ({gameId, token, name}))
        res.json({
            code: baseEnum.ResponseCode.success,
            simulatePlayers
        })
    }

    static async newSimulatePlayer(req, res) {
        const {params: {gameId}, body: {name}} = req
        const token = Token.geneToken(Math.random())
        try {
            await new SimulatePlayerModel({gameId, token, name}).save()
            res.json({
                code: baseEnum.ResponseCode.success,
                token
            })
        } catch (e) {
            res.json({
                code: baseEnum.ResponseCode.serverError
            })
        }
    }

    static async getMoveLogs(req, res) {
        const {params: {gameId}} = req
        try {
            const moveLogs = await MoveLogModel.find({gameId}).lean()
            res.json({
                code: baseEnum.ResponseCode.success,
                moveLogs
            })
        } catch (err) {
            Log.e(err)
            res.json({
                code: baseEnum.ResponseCode.serverError
            })
        }
    }

    static async getHistoryGameThumbs(req, res) {
        const {user} = req
        try {
            const historyGameThumbs: Array<IGameThumb> = (await GameModel.find({
                owner: user.id,
                namespace: Setting.namespace
            })
                .limit(CONFIG.historyGamesListSize)
                .sort({createAt: -1})).map(({id, namespace, title, createAt}) => ({id, namespace, title, createAt}))
            res.json({
                code: baseEnum.ResponseCode.success,
                historyGameThumbs
            })
        } catch (err) {
            res.json({
                code: baseEnum.ResponseCode.serverError
            })
        }
    }
}
