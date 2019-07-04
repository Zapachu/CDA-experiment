import {Request} from "express"

interface IRequest extends Request {
    _startTime: any
}


const useLog = (app) => {
    // cal run time
    app.use((req: IRequest, res, next) => {
        req._startTime = new Date()
        let calResponseTime = () => {
            let now: any = new Date()
            let deltaTime = now - req._startTime
            console.log(`${req.method.toLowerCase()} ${req.url} -- ${deltaTime}ms ${new Date()} `)
        }
        res.once('finish', calResponseTime)
        next()
    })
}

export {
    useLog
}
