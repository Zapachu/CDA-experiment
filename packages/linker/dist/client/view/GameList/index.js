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
var style = require("./style.scss");
var _client_util_1 = require("@client-util");
var _antd_component_1 = require("@antd-component");
var share_1 = require("@elf/share");
var ListItem = _antd_component_1.List.Item, ListItemMeta = ListItem.Meta;
exports.GameList = function (_a) {
    var history = _a.history, user = _a.user;
    if (user.role === share_1.AcademusRole.student) {
        history.push('/join');
        return null;
    }
    var lang = _client_util_1.Lang.extractLang({
        join: ['快速加入', 'Join'],
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        cancel: ['取消', 'Cancel'],
        submit: ['提交', 'Submit']
    });
    var _b = __read(react_1.useState(0), 2), count = _b[0], setCount = _b[1];
    var _c = __read(react_1.useState([]), 2), gameList = _c[0], setGameList = _c[1];
    react_1.useEffect(function () { return fetchPage(0); }, []);
    function fetchPage(page) {
        _client_util_1.Api.getGameList(page).then(function (_a) {
            var gameList = _a.gameList, count = _a.count;
            setCount(count);
            setGameList(gameList);
        });
    }
    return react_1.default.createElement("section", { className: style.gameList },
        react_1.default.createElement(_antd_component_1.Button, { style: { margin: '2rem' }, type: 'primary', onClick: function () { return history.push('/join'); } }, lang.join),
        react_1.default.createElement(_antd_component_1.List, { grid: { gutter: 24, xl: 4, md: 3, sm: 2, xs: 1 }, dataSource: gameList, renderItem: function (_a) {
                var id = _a.id, title = _a.title, desc = _a.desc;
                return react_1.default.createElement(ListItem, { key: id },
                    react_1.default.createElement("section", { className: style.gameItem, onClick: function () { return history.push(id ? "/info/" + id : '/baseInfo'); } },
                        react_1.default.createElement(react_1.Fragment, null,
                            react_1.default.createElement(ListItemMeta, { title: title, description: desc.slice(0, 50) + (desc.length > 50 ? '...' : '') }))));
            } }),
        react_1.default.createElement(_antd_component_1.Pagination, __assign({}, {
            total: count,
            pageSize: 11,
            onChange: function (page) { return fetchPage(page - 1); },
            style: {
                textAlign: 'center'
            }
        })));
};
//# sourceMappingURL=index.js.map