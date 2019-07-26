"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisKey = {
    share_GameCode: function (gameId) { return "shareGameCode:" + gameId; },
    share_CodeGame: function (code) { return "shareCodeGame:" + code; }
};
//# sourceMappingURL=index.js.map