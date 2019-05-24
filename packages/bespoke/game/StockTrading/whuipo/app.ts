import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import session from 'express-session'
import mongoose from 'mongoose'
import connectRedis from 'connect-redis'
import Redis from 'ioredis'
import lusca from 'lusca';
import path from 'path';
import http from 'http';
import morgan from 'morgan'
import socket from 'socket.io'
import passport from 'passport'

import router from './router'
import {handleSocketInit} from './controller'

import settings from './settings'

const RedisStore = connectRedis(session);

/**
 * Normalize a port into a number, string, or false.
 */
let normalizePort = val => {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */
let onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */
let onListening = () => {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
};

let app = express();

// Database
if (settings.mongouser) {
  mongoose.connect(
    settings.mongouri,
    { user: settings.mongouser, pass: settings.mongopass, useMongoClient: true }
  );
} else {
  mongoose.connect(
    settings.mongouri,
    { useMongoClient: true }
  );
}
mongoose.connection.on('error', () => {
  console.error(
    'MongoDB Connection Error. Please make sure MongoDB is running.'
  );
});

const redisClient = new Redis({
  port: settings.redisport,
  host: settings.redishost,
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compression());

// uncomment after placing your favicon in /public
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '30mb',
    parameterLimit: 30000
  })
);
// app.use(validator());

let sessionSet = {
  name: 'whuipo.sid',
  resave: true,
  saveUninitialized: true,
  secret: settings.sessionSecret,
  store: new RedisStore({
    client: redisClient as any,
    ttl: 60 * 24 * 60 * 30 // expire time in seconds
  }),
  cookie: {
    path: '/',
    domain: process.env.NODE_ENV !== 'production'　?  null :  'ancademy.org', // TODO
    maxAge: 1000 * 60 * 24 * 7 // 24 hours
  }
};
app.use(session(sessionSet));

/**csrf whitelist*/
// const csrfExclude = [];

app.use((req, res, next) => {
  // CSRF protection.
  // if (_.includes(csrfExclude, req.path)) {
  //   return next();
  // }
  lusca.csrf()(req, res, next);
});

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


// server静态文件
app.use(
  settings.rootname + '/static',
  express.static(path.join(__dirname, 'dist'), { maxAge: '10d' })
);


//routes
app.use(settings.rootname || '/', router);

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || '3020');
app.set('port', port);

/**
 * Create HTTP server.
 */
let server = http.createServer(app);

const io = socket(server)
handleSocketInit(io)
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
