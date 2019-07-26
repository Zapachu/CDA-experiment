"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisKey = {
    verifyCodeSendTimes: function (nationCode, phoneNumber) { return "verifyCodeSendTimes:" + nationCode + ":" + phoneNumber; },
    verifyCode: function (nationCode, phoneNumber) { return "verifyCode:" + nationCode + ":" + phoneNumber; },
    share_GameCode: function (gameId) { return "shareCode:" + gameId; },
    share_CodeGame: function (code) { return "shareCodeMapping:" + code; },
    gameState: function (gameId) { return "gameState:" + gameId; },
    playerState: function (gameId, token) { return "playerState:" + gameId + ":" + token; },
    playerStates: function (gameId) { return "playerState:" + gameId + ":*"; },
    gameServer: function (namespace) { return "bespokeGameServer:" + namespace; }
};
