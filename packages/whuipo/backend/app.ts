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
import socketSession from 'express-socket.io-session'
import socketPassport from 'passport.socketio'
import cookieParser from 'cookie-parser'
import headdump from 'heapdump'
import router from './router'
import {handleSocketInit, handleSocketPassportFailed, handleSocketPassportSuccess} from './controller'

import {elfSetting} from '@elf/setting'
import config from './config'

console.log(headdump)

const RedisStore = connectRedis(session)

/**
 * Normalize a port into a number, string, or false.
 */
let normalizePort = val => {
  let port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }
  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
let onError = error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
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

/**
 * Event listener for HTTP server "listening" event.
 */
let onListening = () => {
  let addr = server.address()
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

let app = express()

// Database
if (elfSetting.mongoUser) {
  mongoose.connect(
      elfSetting.mongoUri,
      {user: elfSetting.mongoUser, pass: elfSetting.mongoPass, useMongoClient: true}
  )
} else {
  mongoose.connect(
      elfSetting.mongoUri,
      {useMongoClient: true}
  )
}
mongoose.connection.on('error', () => {
  console.error(
      'MongoDB Connection Error. Please make sure MongoDB is running.'
  )
})

const redisClient = new Redis({
  port: elfSetting.redisPort,
  host: elfSetting.redisHost
})


app.use(compression())
app.use(cookieParser())
// uncomment after placing your favicon in /public
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '30mb',
      parameterLimit: 30000
    })
)

// server静态文件
app.use(
    config.rootname + '/static',
    express.static(path.resolve(__dirname, '../dist'), {maxAge: '10d'})
)

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
app.use(sessionMiddleWare)

/**csrf whitelist*/
// const csrfExclude = [];

app.use((req, res, next) => {
  // CSRF protection.
  // if (_.includes(csrfExclude, req.path)) {
  //   return next();
  // }
  lusca.csrf()(req, res, next)
})

app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})


//routes
app.use(config.rootname || '/', router)

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || '3020')
app.set('port', port)

/**
 * Create HTTP server.
 */
let server = http.createServer(app)

const io = socket(server)
io.adapter(socketRedis({host: elfSetting.redisHost, port: elfSetting.redisPort}))
io.use(socketSession(sessionMiddleWare, {
  autoSave: true
}))
io.use(socketPassport.authorize({
  cookieParser: cookieParser,
  key: elfSetting.sessionName,
  secret: elfSetting.sessionSecret,
  store: sessionStore,
  success: handleSocketPassportSuccess,
  fail: handleSocketPassportFailed
}))
handleSocketInit(io)
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
