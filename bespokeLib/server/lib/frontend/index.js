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
require("./initial.scss");
var React = require("react");
var component_1 = require("@elf/component");
var react_router_dom_1 = require("react-router-dom");
var share_1 = require("@bespoke/share");
var Login_1 = require("./Login");
var Dashboard_1 = require("./Dashboard");
var Create_1 = require("./Create");
var Info_1 = require("./Info");
var Share_1 = require("./Share");
var Join_1 = require("./Join");
var Play_1 = require("./Play");
var Configuration_1 = require("./Configuration");
var react_dom_1 = require("react-dom");
var util_1 = require("./util");
function renderRoot(pageProps, rootContainer) {
    var Route = function (_a) {
        var Component = _a.component, routeProps = __rest(_a, ["component"]);
        return React.createElement(react_router_dom_1.Route, __assign({}, routeProps, { render: function (props) {
                return React.createElement(Component, __assign({}, pageProps, props));
            } }));
    };
    react_dom_1.render(React.createElement("section", null,
        React.createElement(react_router_dom_1.BrowserRouter, { key: component_1.Lang.activeLanguage, basename: share_1.config.rootName + "/" + NAMESPACE },
            React.createElement(react_router_dom_1.Switch, null,
                React.createElement(Route, { exact: true, path: "/", component: Dashboard_1.Dashboard }),
                React.createElement(Route, { path: '/create', component: Create_1.Create }),
                React.createElement(Route, { path: '/play/:gameId', component: Play_1.Play }),
                React.createElement(Route, { path: '/configuration/:gameId', component: Configuration_1.Configuration }),
                React.createElement(Route, { path: '/login', component: Login_1.Login }),
                React.createElement(Route, { path: '/dashboard', component: Dashboard_1.Dashboard }),
                React.createElement(Route, { path: '/info/:gameId', component: Info_1.Info }),
                React.createElement(Route, { path: '/share/:gameId', component: Share_1.Share }),
                React.createElement(Route, { path: '/join', component: Join_1.Join }),
                React.createElement(Route, { path: '/*' },
                    React.createElement(react_router_dom_1.Redirect, { to: '/' })))),
        WITH_LINKER ? null :
            React.createElement("div", { style: { position: 'absolute', right: 32, top: 16, zIndex: 1000 } },
                React.createElement(util_1.Button, { size: 'small', onClick: function () { return component_1.Lang.switchLang(component_1.Lang.activeLanguage === component_1.Language.en ? component_1.Language.zh : component_1.Language.en); } }, component_1.Lang.activeLanguage === component_1.Language.en ? '中文' : 'English'))), rootContainer);
}
function emptyPage(label) {
    return function () { return React.createElement("div", { style: {
            fontSize: '2rem',
            margin: '2rem',
            textAlign: 'center',
            color: '#999'
        } }, label); };
}
function registerOnBespoke(gameTemplate) {
    var template = __assign({ Create: emptyPage(component_1.Lang.extractLang({ label: ['无可配置参数', 'No parameters to config'] }).label), Info: emptyPage(component_1.Lang.extractLang({ label: ['无配置', 'No Configuration'] }).label), Play4Owner: emptyPage(component_1.Lang.extractLang({ label: ['实验进行中', 'Playing...'] }).label), Result: emptyPage(component_1.Lang.extractLang({ label: ['实验已结束', 'GAME OVER'] }).label), Result4Owner: emptyPage(component_1.Lang.extractLang({ label: ['实验已结束', 'GAME OVER'] }).label) }, gameTemplate);
    util_1.Api.getUser().then(function (_a) {
        var user = _a.user;
        var rootContainer = document.body.appendChild(document.createElement('div')), props = { gameTemplate: template, user: user };
        renderRoot(props, rootContainer);
        component_1.Lang.switchListeners.push(function () { return renderRoot(props, rootContainer); });
    });
}
exports.registerOnBespoke = registerOnBespoke;
//# sourceMappingURL=index.js.map