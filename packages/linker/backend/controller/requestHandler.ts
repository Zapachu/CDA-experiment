import { config, IActor } from 'linker-share'
import * as path from 'path'
import { NextFunction, Request, Response } from 'express'
import { Token } from '@elf/util'
import { AcademusRole, Actor, historyGamesListSize, IGameThumb, ResponseCode } from '@elf/share'
import { GameService, PlayerService } from '../service'
import { GameModel } from '../model'

export class UserCtrl {
  static async renderApp(req: Request, res: Response) {
    res.sendFile(path.resolve(__dirname, '../../dist/index.html'))
  }

  static loggedIn(req, res: Response, next: NextFunction) {
    const { prefix, login } = config.academus.route
    req.isAuthenticated() ? next() : res.redirect(`${prefix}${login}`)
  }

  static mobileValid(req, res: Response, next) {
    const { prefix, profileMobile } = config.academus.route
    const { mobile } = req.user
    mobile && !mobile.startsWith('null') ? next() : res.redirect(`${prefix}${profileMobile}`)
  }

  static isTeacher(req, res: Response, next) {
    req.user.role === AcademusRole.teacher ? next() : res.redirect(`/${config.rootName}/join`)
  }

  static async isNamespaceAccessible(req, res: Response, next) {
    const gameServers = await GameService.getHeartBeats(req.user._id.toString())
    gameServers.some(({ namespace }) => namespace === req.params.namespace)
      ? next()
      : res.redirect(`/${config.rootName}`)
  }

  static async isGameAccessible(req, res: Response, next: NextFunction) {
    const {
        user: { _id },
        params: { gameId }
      } = req,
      userId = _id.toString()
    const { owner } = await GameService.getGame(gameId)
    if (owner === userId) {
      return next()
    }
    const player = await PlayerService.findPlayer(gameId, userId)
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
    const {
      user: { _id, name, role, mobile, orgCode }
    } = req
    res.json({
      code: ResponseCode.success,
      user: { id: _id.toString(), name, role, mobile, orgCode }
    })
  }
}

export class GameCtrl {
  static async getJsUrl(req: Request, res: Response) {
    const {
      params: { namespace }
    } = req
    const heartBeat = (await GameService.getHeartBeats()).find(s => s.namespace === namespace)
    res.json(
      heartBeat
        ? {
            code: ResponseCode.success,
            jsUrl: heartBeat.jsUrl
          }
        : {
            code: ResponseCode.notFound
          }
    )
  }

  static async saveNewGame(req, res: Response) {
    const {
      body: { title, desc, namespace, params },
      user: { id: owner, orgCode },
      session
    } = req
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

  static async getBaseGame(req: Request, res: Response) {
    const { gameId } = req.params
    const { params, ...game } = await GameService.getGame(gameId)
    res.json({
      code: ResponseCode.success,
      game
    })
  }

  static async getGame(req: Request, res: Response) {
    const { gameId } = req.params
    const game = await GameService.getGame(gameId)
    res.json({
      code: ResponseCode.success,
      game
    })
  }

  static async joinGame(req, res) {
    const {
        user: { _id },
        params: { gameId }
      } = req,
      userId = _id.toString()
    try {
      const player = await PlayerService.findPlayer(gameId, userId)
      if (!player) {
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
    const {
        user,
        params: { gameId }
      } = req,
      userId = user._id.toString()
    const game = await GameService.getGame(gameId),
      player = await PlayerService.findPlayer(gameId, userId)
    const token = userId === game.owner ? Token.geneToken(userId) : player.token,
      type = userId === game.owner ? Actor.owner : Actor.player,
      actor: IActor = { token, type }
    req.session.actor = actor
    res.json({
      code: ResponseCode.success,
      game,
      actor
    })
  }

  static async getHistoryGameThumbs(req, res) {
    const {
      user,
      params: { namespace }
    } = req
    try {
      const historyGameThumbs: Array<IGameThumb> = (
        await GameModel.find({
          owner: user.id,
          namespace: namespace
        })
          .limit(historyGamesListSize)
          .sort({ createAt: -1 })
      ).map(({ id, namespace, title, createAt }) => ({ id, namespace, title, createAt }))
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
