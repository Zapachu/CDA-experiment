"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var request_1 = require("./request");
exports.Api = request_1.Request;
var fileLoader_1 = require("./fileLoader");
exports.loadScript = fileLoader_1.loadScript;
var component_1 = require("@elf/component");
exports.Lang = component_1.Lang;
function getCookie(key) {
    return getCookies().find(function (str) { return str.startsWith(key + "="); }).substring(key.length + 1);
}
exports.getCookie = getCookie;
function getCookies() {
    return decodeURIComponent(document.cookie).split('; ');
}
exports.getCookies = getCookies;
function genePhaseKey() {
    var res = '';
    while (res.length < 3) {
        res += String.fromCharCode(~~(Math.random() * 26) + 65);
    }
    return res;
}
exports.genePhaseKey = genePhaseKey;
exports.connCtx = function (Context) {
    return function (ComponentClass) {
        var ConsumerWrapper = function (props) {
            return React.createElement(Context.Consumer, null, function (context) {
                return React.createElement(ComponentClass, __assign({}, context, props));
            });
        };
        return ConsumerWrapper;
    };
};
//# sourceMappingURL=index.js.map