"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    rootName: 'elf',
    apiPrefix: 'api',
    socketPath: '/elf/socket.io',
    academus: {
        route: {
            prefix: '',
            login: '/login',
            profileMobile: '/profile/mobile',
            join: '/subject/fastJoin',
            home: function (orgCode, gameId) { return "/org/" + orgCode + "/task/game/item/" + gameId; }
        }
    }
};
