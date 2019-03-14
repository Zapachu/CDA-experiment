'use strict'

import {ErrorPage} from './errorPage'
import {gen32Token} from './gen32Token'

const SessionTokenCheck = (app) => {
    app.use((req, res, next) => {
        console.log(req.url)

        const excludes = [
            'static',
            '/phases/list'
        ]

        let ignore = false
        let requrl = req.originalUrl

        console.log(requrl)

        console.log(excludes)

        for (let url of excludes) {
            if (requrl.includes(url)) {
                ignore = true
                break
            }
        }

        if (ignore) {
            return next()
        }

        if (req.user) {
            const sessionToken = req.session.token
            const sessionPlayerId = req.session.playerId
            const convertToken = gen32Token(req.user._id.toString())

            console.log(sessionToken)
            console.log(sessionPlayerId)
            console.log(convertToken)

            if (sessionToken === convertToken) {
                return next()
            }

            if (sessionPlayerId) {
                const playerToken = gen32Token(sessionPlayerId)
                console.log(playerToken)
                if (playerToken === sessionToken) {
                    return next()
                }
            }

            return ErrorPage(res, 'Token Missing')
        } else {
            return ErrorPage(res, 'Not Login')
        }
    })
}

export {
    SessionTokenCheck
}
