"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = require("net");
var IpcConnection_1 = require("./IpcConnection");
var Log_1 = require("./Log");
var namespace = 'hello';
setTimeout(function () {
    net_1.createServer(function (socket) {
        return new IpcConnection_1.IpcConnection(socket)
            .on(IpcConnection_1.IpcEvent.asDaemon, function (name, cb0, cb1, cb2) {
            cb0(1);
            cb1('hello');
            cb2([1, 2, 3]);
        });
    }).listen(IpcConnection_1.getSocketPath(namespace));
}, 3e3);
IpcConnection_1.IpcConnection.connect(namespace).then(function (ipcConnection) {
    return ipcConnection.emit(IpcConnection_1.IpcEvent.asDaemon, 'hello', function (a) { return Log_1.Log.d(a); }, function (b) { return Log_1.Log.d(b); }, function (c) { return Log_1.Log.d(c); });
});
