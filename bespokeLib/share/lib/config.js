"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    rootName: 'bespoke',
    apiPrefix: 'api',
    socketPath: function (namespace) { return "/bespoke/" + namespace + "/socket.io"; },
    devPort: {
        client: 8080,
        server: 8081
    },
    minMoveInterval: 500,
    vcodeLifetime: 60
};
