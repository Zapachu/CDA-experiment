import {resolve} from 'path'
import {Response, Router} from 'express'
import {BaseLogic, ResponseCode, Server} from '@bespoke/server'
import Controller from './Controller'
import {FetchRoute, namespace} from './config'

const router = Router()
    .get(FetchRoute.getUserInfo, async (req, res: Response) => {
            const {user: {mobile, name}, params: {gameId}, query: actor} = req
            const {stateManager} = await BaseLogic.getLogic(gameId)
            const playerState = await stateManager.getPlayerState(actor)
            playerState.userInfo = {mobile, name}
            await stateManager.syncState()
            return res.json({
                    code: ResponseCode.success
            })
    })

Server.start(namespace, Controller, resolve(__dirname, '../dist'), router)