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
var _client_util_1 = require("@client-util");
var React = require("react");
var react_dom_1 = require("react-dom");
var view_1 = require("./view");
require('./initial.scss');
var _client_util_2 = require("@client-util");
exports.Lang = _client_util_2.Lang;
exports.phaseTemplates = {};
function registerOnElf(namespace, phaseTemplate) {
    exports.phaseTemplates[namespace] = __assign({ namespace: namespace, Create: function () { return null; } }, phaseTemplate);
}
exports.registerOnElf = registerOnElf;
var rootContainer = document.body.appendChild(document.createElement('div'));
react_dom_1.render(React.createElement(view_1.Root, null), rootContainer);
_client_util_1.Lang.switchListeners.push(function () {
    react_dom_1.render(React.createElement(view_1.Root, { key: _client_util_1.Lang.activeLanguage }), rootContainer);
});
//# sourceMappingURL=index.js.map