import {resolve} from 'path'
import * as Express from 'express'
import {namespace} from './config'
import {Server, config} from 'bespoke-server'
import Controller from './Controller'

const egretRouter = Express.Router()
    .use('/egret/bin-debug', Express.static(resolve(__dirname, '../egret/bin-debug')))
    .use('/egret', Express.static(resolve(__dirname, '../egret'), {maxAge: '10d'}))
    .use('/egret/*', (req, res: Express.Response) => res.redirect(`/${config.rootName}/${namespace}/egret`))

Server.start(
    {namespace, staticPath: resolve(__dirname, '../dist')},
    {Controller},
    egretRouter
)
