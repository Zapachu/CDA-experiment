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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var style = require("./initial.scss");
var react_router_dom_1 = require("react-router-dom");
var _common_1 = require("@common");
var _client_context_1 = require("@client-context");
var component_1 = require("@elf/component");
var _client_component_1 = require("@client-component");
var _client_util_1 = require("@client-util");
var react_router_1 = require("react-router");
var Play_1 = require("./Play");
var Info_1 = require("./Info");
var GameList_1 = require("./GameList");
var Create_1 = require("./Create");
var _antd_component_1 = require("@antd-component");
function toV5(route) {
    return function (_a) {
        var history = _a.history, gameId = _a.match.params.gameId;
        history.goBack();
        window.open(route(gameId), '_blank');
        return null;
    };
}
exports.Root = function () {
    var academusRoute = _common_1.config.academus.route;
    var _a = __read(react_1.useState(), 2), user = _a[0], setUser = _a[1];
    react_1.useEffect(function () {
        _client_util_1.Api.getUser().then(function (_a) {
            var user = _a.user;
            return setUser(user);
        });
    }, []);
    return user ?
        react_1.default.createElement("section", { className: style.rootView },
            react_1.default.createElement(_client_context_1.rootContext.Provider, { value: { user: user } },
                react_1.default.createElement(_antd_component_1.Affix, { style: { position: 'absolute', right: 32, top: 16, zIndex: 1000 } },
                    react_1.default.createElement(_antd_component_1.Button, { size: 'small', onClick: function () { return component_1.Lang.switchLang(component_1.Lang.activeLanguage === component_1.Language.en ? component_1.Language.zh : component_1.Language.en); } }, component_1.Lang.activeLanguage === component_1.Language.en ? '中文' : 'English')),
                react_1.default.createElement(react_router_dom_1.BrowserRouter, { basename: _common_1.config.rootName },
                    react_1.default.createElement(react_router_1.Switch, null,
                        react_1.default.createElement(react_router_1.Route, { path: '/Create/:namespace', component: Create_1.Create }),
                        react_1.default.createElement(react_router_1.Route, { path: '/info/:gameId', component: Info_1.Info }),
                        react_1.default.createElement(react_router_1.Route, { path: '/play/:gameId', component: Play_1.Play }),
                        react_1.default.createElement(react_router_1.Route, { path: '/share/:gameId', component: toV5(function (gameId) { return "" + academusRoute.prefix + academusRoute.share(gameId); }) }),
                        react_1.default.createElement(react_router_1.Route, { path: '/join', component: toV5(function () { return "" + academusRoute.prefix + academusRoute.join; }) }),
                        react_1.default.createElement(react_router_1.Route, { path: '/player/:gameId', component: toV5(function (gameId) { return "" + academusRoute.prefix + academusRoute.member(user.orgCode, gameId); }) }),
                        react_1.default.createElement(react_router_1.Route, { path: '/*', component: function (props) {
                                return react_1.default.createElement(GameList_1.GameList, __assign({}, props, { user: user }));
                            } }))))) : react_1.default.createElement(_client_component_1.Loading, null);
};
//# sourceMappingURL=index.js.map