import {resolve} from 'path'
import * as Express from 'express'
import {namespace} from './config'
import {config, gameId2PlayUrl, RedisCall, Server} from 'bespoke-server'
import Controller from './Controller'
import {CreateGame} from 'elf-protocol'

const egretRouter = Express.Router()
    .use('/egret/bin-debug', Express.static(resolve(__dirname, '../egret/bin-debug')))
    .use('/egret', Express.static(resolve(__dirname, '../egret'), {maxAge: '10d'}))
    .use('/egret/*', (req, res: Express.Response) => res.redirect(`/${config.rootName}/${namespace}/egret`))

Server.start(
    {namespace, staticPath: resolve(__dirname, '../dist')},
    {Controller},
    egretRouter
)

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(
    CreateGame.name(namespace),
    async ({keys}) => {
        const gameId = await Server.newGame({
            title: `DoubleAuction:${new Date().toUTCString()}`,
            desc: '',
            params: {}
        })
        return {playUrls: keys.map(key => gameId2PlayUrl(gameId, key))}
    }
)
