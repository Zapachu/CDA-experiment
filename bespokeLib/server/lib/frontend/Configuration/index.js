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
var React = require("react");
var style = require("./style.scss");
var component_1 = require("@elf/component");
var util_1 = require("../util");
var antd_1 = require("antd");
function Configuration(_a) {
    var history = _a.history, gameId = _a.match.params.gameId, Create = _a.gameTemplate.Create;
    var lang = component_1.Lang.extractLang({
        title: ['实验标题', 'Game Title'],
        playRoom: ['返回游戏', 'BACK TO GAME']
    });
    var _b = __read(React.useState(null), 2), game = _b[0], setGame = _b[1];
    React.useEffect(function () {
        util_1.Api.getGame(gameId).then(function (_a) {
            var game = _a.game;
            return setGame(game);
        });
    }, []);
    return game ? React.createElement("section", { className: style.configuration },
        React.createElement("div", { className: style.titleWrapper },
            React.createElement(antd_1.Input, { size: 'large', value: game.title, placeholder: lang.title, onChange: function () { return null; } })),
        React.createElement(Create, __assign({}, {
            submitable: true,
            params: game.params,
            setSubmitable: function () { return null; },
            setParams: function () { return null; }
        })),
        React.createElement("div", { className: style.backBtnWrapper },
            React.createElement(antd_1.Button, { type: 'primary', onClick: function () { return history.push("/play/" + gameId); } }, lang.playRoom))) : null;
}
exports.Configuration = Configuration;
//# sourceMappingURL=index.js.map