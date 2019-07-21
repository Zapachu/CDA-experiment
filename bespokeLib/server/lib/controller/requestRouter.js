"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var requestHandler_1 = require("./requestHandler");
var userApiRouter = express_1.Router()
    .get('/verifyCode', requestHandler_1.UserCtrl.getVerifyCode)
    .post('/login', requestHandler_1.UserCtrl.handleLogin)
    .get('/', requestHandler_1.UserCtrl.getUser)
    .post('/logout', requestHandler_1.UserCtrl.handleLogout);
var gameApiRouter = express_1.Router()
    .get('/historyThumb', requestHandler_1.GameCtrl.getHistoryGameThumbs)
    .post('/new', requestHandler_1.GameCtrl.newGame)
    .get('/share/:gameId', requestHandler_1.GameCtrl.shareGame)
    .post('/joinWithShareCode', requestHandler_1.GameCtrl.joinWithShareCode)
    .get('/simulatePlayer/:gameId', requestHandler_1.GameCtrl.getSimulatePlayers)
    .post('/simulatePlayer/:gameId', requestHandler_1.GameCtrl.newSimulatePlayer)
    .get('/moveLogs/:gameId', requestHandler_1.GameCtrl.getMoveLogs)
    .get('/:gameId', requestHandler_1.GameCtrl.getGame);
var apiRouter = express_1.Router()
    .use('/user', userApiRouter)
    .use('/game', gameApiRouter);
exports.router = express_1.Router()
    .use('/api', apiRouter)
    .get('/*', requestHandler_1.UserCtrl.renderApp);
