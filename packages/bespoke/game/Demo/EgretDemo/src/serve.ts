import {resolve} from 'path'
import * as Express from 'express'
import {namespace} from './config'
import {Server, config} from 'bespoke-server'
import Controller from './Controller'

const egretRouter = Express.Router()
    .use('/egret', Express.static(resolve(__dirname, '../egret')))
    .use('/egret/*', (req, res: Express.Response) => res.redirect(`/${config.rootName}/${namespace}/egret`))

Server.start(
    {staticPath: resolve(__dirname, '../dist')},
    {Controller},
    egretRouter
)
