"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    rootName: 'elf',
    apiPrefix: 'api',
    socketPath: '/elf/socket.io',
    academus: {
        route: {
            prefix: '/v5',
            login: '/login',
            profileMobile: '/profile/mobile',
            share: function (gameId) { return "/share?id=" + gameId + "&type=10"; },
            join: '/subject/fastJoin',
            member: function (orgCode, gameId) { return "/org/" + orgCode + "/task/game/item/" + gameId + "/members"; }
        }
    }
};
//# sourceMappingURL=config.js.map