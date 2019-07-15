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
function Info(_a) {
    var history = _a.history, gameId = _a.match.params.gameId;
    var lang = component_1.Lang.extractLang({
        enterRoom: ['进入实验', 'Enter Game'],
        joinGame: ['加入实验', 'Join Game']
    });
    var _b = __read(React.useState(null), 2), game = _b[0], setGame = _b[1], _c = __read(React.useState(null), 2), user = _c[0], setUser = _c[1];
    React.useEffect(function () {
        util_1.Api.getGame(gameId).then(function (_a) {
            var game = _a.game;
            return setGame(game);
        });
        util_1.Api.getUser().then(function (_a) {
            var user = _a.user;
            return setUser(user);
        });
    }, []);
    if (!game) {
        return React.createElement(component_1.MaskLoading, null);
    }
    return React.createElement("div", { className: style.info },
        React.createElement("ul", { className: style.featureButtons },
            React.createElement("li", __assign({}, {
                style: {
                    backgroundColor: '#ff888e'
                },
                onClick: function () { return history.push("/play/" + gameId + location.search); }
            }), user && (game.owner === user.id) ? lang.enterRoom : lang.joinGame)));
}
exports.Info = Info;
//# sourceMappingURL=index.js.map