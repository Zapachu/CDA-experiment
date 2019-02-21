const express = require('express')
import * as errorhandler from 'errorhandler'
import * as httpProxy from 'http-proxy-middleware'
const { Gunzip, Gzip } = require('zlib')
import { Response, Request } from 'express'

const app = express()


let proxy = httpProxy({
    target: 'https://cessoxford.eu.qualtrics.com',
    changeOrigin: true,
    ws: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    onProxyRes: async (proxyRes, req, res) => {
        console.log(req.url, req.method)
        const originWrite = res.write
        const originEnd = res.end

        if (!req.url.includes('.js.map') && req.url.includes('/jfe/form') && req.method === 'GET') {
            console.log('Main Page')
            let data = ''
            let gunZipStream = Gunzip()
            let gzipStream = Gzip()

            const insert_scripts = `
                <script>
                    (function () {
                        setInterval(() => {
                            console.log('debug: find end sign')
                            if (document.getElementById('EndOfSurvey')) {
                                // window.location.href = $/{nextPhaseUrl}
                                console.log('end finded')
                                window.location.href = 'https://bing.com'
                            }
                        }, 2000)
                    })()
                </script>
            `

            gunZipStream.on('data', chunk => {
                data += chunk
            })
            gunZipStream.on('end', () => {
                gzipStream.on('data', chunk => {
                    originWrite.call(res, chunk)
                })
                gzipStream.on('end', () => {
                    originEnd.call(res)
                })
                const dataStart = data.split('</body>')[0]
                const dataEnd = data.split('</body>')[1]
                const newData = dataStart + insert_scripts + dataEnd
                gzipStream.write(new Buffer(newData))
                gzipStream.end()
            })

            res.write = (chunk) => {
                gunZipStream.write(chunk)
                return true
            }
            res.end = () => {
                gunZipStream.end()
            }
        }

        // if (data.toString().includes('"ProgressPercent":100')) {

        // if (req.url.includes('/form') && req.url.includes('/next') && req.method === 'POST') {
        //     let data = ''
        //     let gzipStream = Gunzip()
        //     gzipStream.on('data', chunk => data += iconv.decode(chunk, 'GBK'))
        //     gzipStream.on('end', () => {
        //         console.log(data)
        //         res.redirect('https://baidu.com')
        //         originEnd.call(res)
        //     })

        //     res.write = (chunk) => {
        //         gzipStream.write(chunk)

        //         return true
        //     }
        //     res.end = () => {
        //         gzipStream.end()
        //     }
        // }
        if (req.url.includes('/form') && req.url.includes('/next') && req.method === 'POST') {

            // try {
            //     proxyRes.pipe(Gunzip().on('data', chunk => data += iconv.decode(chunk, 'GBK'))
            //         .on('end', () => {
            //             if (data.toString().includes('"ProgressPercent":100')) {
            //                 console.log('-----------Find End Sign--------')
            //                 // res.writeHead(302, {
            //                 //     location: 'https://baidu.com'
            //                 // })
            //                 // res.end()
            //                 // throw 'End'
            //                 proxyRes.statusCode = 302
            //                 proxyRes.headers.location = 'https://bing.com'
            //                 // res.statusCode = 302
            //                 // res.end()

            //             }
            //         }))
            // } catch (err) {
            //     if (err) {
            //         console.log(err)
            //     }
            // }
        }
    }
})

app.use((req: Request, res: Response, next) => {
    next()
})

app.use(proxy)
app.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.');
});
app.use(errorhandler())
const server = app.listen(3071, () => {
    console.log('listening at ', server.address().port)
})