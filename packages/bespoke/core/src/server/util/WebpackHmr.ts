import {config} from '@dev/common'
import * as fs from 'fs'
import * as path from 'path'
import * as webpack from 'webpack'
import {Express, Response, NextFunction} from 'express'
import {webpackHmr, setting} from './util'
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
        if (webpackHmr) {
            WebpackHmr.compiler.outputFileSystem.readFile(path.join(WebpackHmr.compiler.outputPath, 'index.html'), (err, result) =>
                err ? next(err) : this.decorateHtml(res, result)
            )
        } else {
            const result = fs.readFileSync(path.resolve(__dirname, `../../client/dist/index.html`)).toString()
            this.decorateHtml(res, result)
        }
    }

    private static decorateHtml(res: Response, body: string) {
        res.set('content-type', 'text/html')
        res.end(body + `<script type="text/javascript" src="${setting.getClientPath()}"></script>`)
    }
}