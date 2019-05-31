const express = require('express')
const WebpackMiddileWare = require('webpack-dev-middleware')
const webpack = require('webpack')
const httpProxy = require('http-proxy')
const http = require('http')

const webpackConfig = require('./webpack.dev.js')
const compiler = webpack(webpackConfig)

const app = express()
app.use(WebpackMiddileWare(compiler, {
    publicPath: webpackConfig.output.publicPath
}))

const httpProxyServer = httpProxy.createProxyServer({
    
    ws: true
})
app.use('/api', (req, res) => {
    httpProxyServer.web(req, res, {
        target: `http://localhost:3020${req.originalUrl}`,
        ignorePath: true
    })
})


const server = http.createServer(app)
server.on('upgrade', function (req, socket, head) {
    console.log('inner ws')
    httpProxyServer.ws(req, socket, head, {
        target: {
            host: 'localhost',
            port: 3020
        }
    })
})
// app.use('/socket', )
server.listen(8000, function () {
    console.log('app start success! http://localhost:8000')
})