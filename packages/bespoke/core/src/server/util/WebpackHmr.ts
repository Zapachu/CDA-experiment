import {config} from '@dev/common'
import * as path from 'path'
import * as webpack from 'webpack'
import {Express, Response, NextFunction} from 'express'
import {setting, webpackHmr} from './util'
import * as webpackDevMiddleware from 'webpack-dev-middleware'
import * as  webpackHotMiddleware from 'webpack-hot-middleware'
import coreWebpackCfg = require('../../client/script/webpack.core')

export class WebpackHmr {
    static compiler = webpack(coreWebpackCfg({webpackHmr}) as any) as any

    static applyHotDevMiddleware(app: Express) {
        if (!webpackHmr) {
            return
        }
        app.use(webpackDevMiddleware(this.compiler, {
            publicPath: `/${config.rootName}/static`
        }))
        app.use(webpackHotMiddleware(this.compiler, {
            path: `/${config.rootName}/__webpack_hmr`
        }))
    }

    static sendIndexHtml(res: Response, next: NextFunction) {
        if (!webpackHmr) {
            return res.sendFile(path.resolve(setting.staticPath, 'index.html'))
        }
        WebpackHmr.compiler.outputFileSystem.readFile(path.join(WebpackHmr.compiler.outputPath, 'index.html'), (err, result) => {
            if (err) {
                return next(err)
            }
            res.set('content-type', 'text/html')
            res.send(result)
            res.end()
        })
    }
}