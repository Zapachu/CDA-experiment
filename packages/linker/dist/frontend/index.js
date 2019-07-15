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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var component_1 = require("@elf/component");
var React = require("react");
var react_dom_1 = require("react-dom");
var react_router_dom_1 = require("react-router-dom");
var linker_share_1 = require("linker-share");
var Play_1 = require("./Play");
var Info_1 = require("./Info");
var Dashboard_1 = require("./Dashboard");
var Create_1 = require("./Create");
var antd_1 = require("antd");
require('./initial.scss');
function registerOnElf(namespace, template) {
    template.namespace = namespace;
    util_1.GameTemplate.setTemplate(template);
}
exports.registerOnElf = registerOnElf;
util_1.Api.getUser().then(function (_a) {
    var user = _a.user;
    var rootContainer = document.body.appendChild(document.createElement('div'));
    renderRoot({ user: user }, rootContainer);
    component_1.Lang.switchListeners.push(function () { return renderRoot({ user: user }, rootContainer); });
});
function renderRoot(pageProps, rootContainer) {
    var Route = function (_a) {
        var Component = _a.component, routeProps = __rest(_a, ["component"]);
        return React.createElement(react_router_dom_1.Route, __assign({}, routeProps, { render: function (props) {
                return React.createElement(Component, __assign({}, pageProps, props));
            } }));
    };
    react_dom_1.render(React.createElement(react_router_dom_1.BrowserRouter, { basename: linker_share_1.config.rootName },
        React.createElement("div", { style: { position: 'absolute', right: 32, top: 16, zIndex: 1000 } },
            React.createElement(antd_1.Button, { size: 'small', onClick: function () { return component_1.Lang.switchLang(component_1.Lang.activeLanguage === component_1.Language.en ? component_1.Language.zh : component_1.Language.en); } }, component_1.Lang.activeLanguage === component_1.Language.en ? '中文' : 'English')),
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(Route, { path: '/Create/:namespace', component: Create_1.Create }),
            React.createElement(Route, { path: '/info/:gameId', component: Info_1.Info }),
            React.createElement(Route, { path: '/play/:gameId', component: Play_1.Play }),
            React.createElement(Route, { component: Dashboard_1.Dashboard }))), rootContainer);
}
//# sourceMappingURL=index.js.map