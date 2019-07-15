"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var linker_share_1 = require("linker-share");
var requestHandler_1 = require("./requestHandler");
var apiPrefix = linker_share_1.config.apiPrefix;
var apiRouter = express_1.Router()
    .use('/user', express_1.Router()
    .get('/', requestHandler_1.UserCtrl.getUser))
    .use('/game', express_1.Router()
    .get('/jsUrl/:namespace', requestHandler_1.GameCtrl.getJsUrl)
    .post('/create', requestHandler_1.GameCtrl.saveNewGame)
    .get('/list', requestHandler_1.GameCtrl.getGameList)
    .get('/actor/:gameId', requestHandler_1.GameCtrl.getActor)
    .get('/share/:gameId', requestHandler_1.GameCtrl.shareGame)
    .post('/joinWithShareCode', requestHandler_1.GameCtrl.joinWithShareCode)
    .post('/join/:gameId', requestHandler_1.GameCtrl.joinGame)
    .get('/baseInfo/:gameId', requestHandler_1.GameCtrl.getBaseGame)
    .get('/:gameId', requestHandler_1.GameCtrl.getGame));
exports.default = express_1.Router()
    .use("/" + apiPrefix, apiRouter)
    .get('/create/:namespace', requestHandler_1.UserCtrl.loggedIn, requestHandler_1.UserCtrl.isTeacher, requestHandler_1.UserCtrl.isNamespaceAccessible, requestHandler_1.UserCtrl.renderApp)
    .get('/play/:gameId', requestHandler_1.UserCtrl.loggedIn, requestHandler_1.UserCtrl.mobileValid, requestHandler_1.UserCtrl.isGameAccessible, requestHandler_1.UserCtrl.renderApp)
    .get('/*', requestHandler_1.UserCtrl.loggedIn, requestHandler_1.UserCtrl.renderApp);
//# sourceMappingURL=requestRouter.js.map