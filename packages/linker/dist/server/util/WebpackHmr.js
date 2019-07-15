"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _common_1 = require("@common");
var path = require("path");
var webpack = require("webpack");
var _server_util_1 = require("@server-util");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var coreWebpackCfg = require("../../client/script/webpack");
var WebpackHmr = /** @class */ (function () {
    function WebpackHmr() {
    }
    WebpackHmr.applyHotDevMiddleware = function (app) {
        if (!_server_util_1.webpackHmr) {
            return;
        }
        app.use(webpackDevMiddleware(this.compiler, {
            publicPath: "/" + _common_1.config.rootName + "/static"
        }));
        app.use(webpackHotMiddleware(this.compiler, {
            path: "/" + _common_1.config.rootName + "/__webpack_hmr"
        }));
    };
    WebpackHmr.sendIndexHtml = function (res, next) {
        if (!_server_util_1.webpackHmr) {
            return res.sendFile(path.resolve(__dirname, '../../../static/index.html'));
        }
        WebpackHmr.compiler.outputFileSystem.readFile(path.join(WebpackHmr.compiler.outputPath, 'index.html'), function (err, result) {
            if (err) {
                return next(err);
            }
            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        });
    };
    WebpackHmr.compiler = webpack(coreWebpackCfg({ webpackHmr: _server_util_1.webpackHmr }));
    return WebpackHmr;
}());
exports.WebpackHmr = WebpackHmr;
//# sourceMappingURL=WebpackHmr.js.map