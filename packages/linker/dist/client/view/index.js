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
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var react_router_dom_1 = require("react-router-dom");
var _common_1 = require("@common");
var component_1 = require("@elf/component");
var Play_1 = require("./Play");
var Info_1 = require("./Info");
var GameList_1 = require("./GameList");
var Create_1 = require("./Create");
var antd_1 = require("antd");
function renderRoot(pageProps, rootContainer) {
    var academusRoute = _common_1.config.academus.route;
    var Route = function (_a) {
        var Component = _a.component, routeProps = __rest(_a, ["component"]);
        return react_1.default.createElement(react_router_dom_1.Route, __assign({}, routeProps, { render: function (props) {
                return react_1.default.createElement(Component, __assign({}, pageProps, props));
            } }));
    };
    react_dom_1.render(react_1.default.createElement(react_router_dom_1.BrowserRouter, { basename: _common_1.config.rootName },
        react_1.default.createElement("div", { style: { position: 'absolute', right: 32, top: 16, zIndex: 1000 } },
            react_1.default.createElement(antd_1.Button, { size: 'small', onClick: function () { return component_1.Lang.switchLang(component_1.Lang.activeLanguage === component_1.Language.en ? component_1.Language.zh : component_1.Language.en); } }, component_1.Lang.activeLanguage === component_1.Language.en ? '中文' : 'English')),
        react_1.default.createElement(react_router_dom_1.Switch, null,
            react_1.default.createElement(Route, { path: '/Create/:namespace', component: Create_1.Create }),
            react_1.default.createElement(Route, { path: '/info/:gameId', component: Info_1.Info }),
            react_1.default.createElement(Route, { path: '/play/:gameId', component: Play_1.Play }),
            react_1.default.createElement(Route, { path: '/share/:gameId', component: toV5(function (gameId) { return "" + academusRoute.prefix + academusRoute.share(gameId); }) }),
            react_1.default.createElement(Route, { path: '/join', component: toV5(function () { return "" + academusRoute.prefix + academusRoute.join; }) }),
            react_1.default.createElement(Route, { path: '/player/:gameId', component: toV5(function (gameId) { return "" + academusRoute.prefix + academusRoute.member(pageProps.user.orgCode, gameId); }) }),
            react_1.default.createElement(Route, { component: GameList_1.GameList }))), rootContainer);
}
exports.renderRoot = renderRoot;
function toV5(route) {
    return function (_a) {
        var history = _a.history, gameId = _a.match.params.gameId;
        history.goBack();
        window.open(route(gameId), '_blank');
        return null;
    };
}
//# sourceMappingURL=index.js.map