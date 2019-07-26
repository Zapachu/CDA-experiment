import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import session from "express-session";
import mongoose from "mongoose";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import lusca from "lusca";
import path from "path";
import http from "http";
import morgan from "morgan";
import socket from "socket.io";
import passport from "passport";
import socketRedis from "socket.io-redis";
import socketSession from "express-socket.io-session";
import socketPassport from "passport.socketio";
import cookieParser from "cookie-parser";
import headdump from "heapdump";

console.log(headdump);

import router from "./router";
import {
  handleSocketInit,
  handleSocketPassportFailed,
  handleSocketPassportSuccess
} from "./controller";

import settings from "./settings";

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
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
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
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
};

let app = express();

// Database
if (settings.mongouser) {
  mongoose.connect(settings.mongouri, {
    user: settings.mongouser,
    pass: settings.mongopass,
    useMongoClient: true
  });
} else {
  mongoose.connect(settings.mongouri, { useMongoClient: true });
}
mongoose.connection.on("error", () => {
  console.error(
    "MongoDB Connection Error. Please make sure MongoDB is running."
  );
});

const redisClient = new Redis({
  port: settings.redisport,
  host: settings.redishost
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(compression());
app.use(cookieParser());
// uncomment after placing your favicon in /public
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "30mb",
    parameterLimit: 30000
  })
);

// server静态文件
const staticPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../dist")
    : path.join(__dirname, "./dist");
app.use(
  settings.rootname + "/static",
  express.static(staticPath, { maxAge: "10d" })
);

const sessionStore = new RedisStore({
  client: redisClient as any,
  ttl: 60 * 24 * 60 * 30 // expire time in seconds
});
let sessionSet = {
  name: settings.sessionId,
  resave: true,
  saveUninitialized: true,
  secret: settings.sessionSecret,
  store: sessionStore,
  cookie: {
    path: "/",
    domain: process.env.NODE_ENV !== "production" ? null : settings.domain, // TODO
    maxAge: 1000 * 60 * 24 * 7 // 24 hours
  }
};
const sessionMiddleWare = session(sessionSet);
app.use(sessionMiddleWare);

/**csrf whitelist*/
// const csrfExclude = [];

app.use((req, res, next) => {
  // CSRF protection.
  // if (_.includes(csrfExclude, req.path)) {
  //   return next();
  // }
  lusca.csrf()(req as any, res as any, next);
});

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//routes
app.use(settings.rootname || "/", router);

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || "3020");
app.set("port", port);

/**
 * Create HTTP server.
 */
let server = http.createServer(app);

const io = socket(server);
io.adapter(socketRedis({ host: settings.redishost, port: settings.redisport }));
io.use(
  socketSession(sessionMiddleWare, {
    autoSave: true
  })
);
io.use(
  socketPassport.authorize({
    cookieParser: cookieParser,
    key: settings.sessionId,
    secret: settings.sessionSecret,
    store: sessionStore,
    success: handleSocketPassportSuccess,
    fail: handleSocketPassportFailed
  })
);
handleSocketInit(io);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
