import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import session from 'express-session'
import mongoose from 'mongoose'
import connectRedis from 'connect-redis'
import Redis from 'ioredis'
import lusca from 'lusca'
import path from 'path'
import http from 'http'
import morgan from 'morgan'
import socket from 'socket.io'
import passport from 'passport'
import socketRedis from 'socket.io-redis'
import socketPassport from 'passport.socketio'
import cookieParser from 'cookie-parser'

import router from './router'
import { handleSocketInit, handleSocketPassportFailed, handleSocketPassportSuccess } from './controllers'

import { elfSetting } from '@elf/setting'
import config from './config'

const RedisStore = connectRedis(session)

let normalizePort = val => {
  let port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }
  return false
}

let onError = error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

let onListening = () => {
  let addr = server.address()
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

let app = express()

if (elfSetting.mongoUser) {
  mongoose.connect(elfSetting.mongoUri, {
    user: elfSetting.mongoUser,
    pass: elfSetting.mongoPass,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
} else {
  mongoose.connect(elfSetting.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure MongoDB is running.')
})

const redisClient = new Redis({
  port: elfSetting.redisPort,
  host: elfSetting.redisHost
})

app.use(compression())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '30mb',
    parameterLimit: 30000
  })
)
app.set('views', path.resolve(__dirname, './views'))
app.set('view engine', 'pug')

const sessionStore = new RedisStore({
  client: redisClient as any,
  ttl: 60 * 24 * 60 * 30 // expire time in seconds
})
let sessionSet = {
  name: elfSetting.sessionName,
  resave: true,
  saveUninitialized: true,
  secret: elfSetting.sessionSecret,
  store: sessionStore,
  cookie: {
    path: '/',
    domain: process.env.NODE_ENV !== 'production' ? null : config.domain, // TODO
    maxAge: 1000 * 60 * 24 * 7 // 24 hours
  }
}
const sessionMiddleWare = session(sessionSet)
app.use((req, res, next) => {
  if (req.method === 'HEAD') {
    // 腾讯云心跳检查 导致一直新建session
    res.end()
  } else {
    sessionMiddleWare(req, res, next)
  }
})

app.use((req, res, next) => {
  lusca.csrf()(req, res, next)
})

app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

const staticPath =
  process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../static') : path.join(__dirname, './static')
app.use(config.rootname + '/static', express.static(staticPath, { maxAge: '10d' }))

app.use(config.rootname || '/', router)

let port = normalizePort(process.env.PORT || '3021')
app.set('port', port)

let server = http.createServer(app)
const io = socket(server, {
  path: `${config.rootname}/socket`
})
io.adapter(socketRedis({ host: elfSetting.redisHost, port: elfSetting.redisPort }))
io.use(
  socketPassport.authorize({
    cookieParser: cookieParser,
    key: elfSetting.sessionName,
    secret: elfSetting.sessionSecret,
    store: sessionStore,
    success: handleSocketPassportSuccess,
    fail: handleSocketPassportFailed
  })
)
handleSocketInit(io)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
