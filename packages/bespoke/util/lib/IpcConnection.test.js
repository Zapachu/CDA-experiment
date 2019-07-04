"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var share_1 = require("@bespoke/share");
var net_1 = require("net");
var _1 = require(".");
var namespace = 'hello';
setTimeout(function () {
    net_1.createServer(function (socket) {
        return new _1.IpcConnection(socket)
            .on(share_1.UnixSocketEvent.asDaemon, function (name, cb0, cb1, cb2) {
            cb0(1);
            cb1('hello');
            cb2([1, 2, 3]);
        });
    }).listen(_1.getSocketPath(namespace));
}, 3e3);
_1.IpcConnection.connect(namespace).then(function (ipcConnection) {
    return ipcConnection.emit(share_1.UnixSocketEvent.asDaemon, 'hello', function (a) { return _1.Log.d(a); }, function (b) { return _1.Log.d(b); }, function (c) { return _1.Log.d(c); });
});
