import express from 'express'
import redis from 'ioredis'

const redisCli = redis()
const rootRouter = express.Router()

rootRouter.get('/',async  (req, res) => {
    const gameList = await redisCli.keys('bespokeGameServer:*')
    console.log(gameList)
    res.render('views', {
        gameList
    })
})
export default rootRouter