"use strict";
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
var share_1 = require("@bespoke/share");
var component_1 = require("@elf/component");
var util_1 = require("../util");
var dateFormat = require("dateformat");
function Dashboard(_a) {
    var history = _a.history, user = _a.user;
    var lang = component_1.Lang.extractLang({
        createGame: ['创建实验', 'Create Game'],
        historyGame: ['历史实验', 'History Game']
    });
    var _b = __read(React.useState([]), 2), historyGameThumbs = _b[0], setHistoryGameThumbs = _b[1];
    React.useEffect(function () {
        if (user && user.role === share_1.AcademusRole.teacher) {
            util_1.Api.getHistoryGames().then(function (_a) {
                var code = _a.code, historyGameThumbs = _a.historyGameThumbs;
                return code === share_1.ResponseCode.success ? setHistoryGameThumbs(historyGameThumbs) : null;
            });
        }
        else {
            history.push('/join');
        }
    }, []);
    return React.createElement("section", { className: style.dashboard },
        React.createElement("div", { className: style.createBtnWrapper },
            React.createElement(component_1.Button, { onClick: function () { return history.push('/create'); }, label: lang.createGame })),
        React.createElement("label", { className: style.title }, lang.historyGame),
        React.createElement("ul", { className: style.historyGames }, historyGameThumbs.map(function (_a) {
            var id = _a.id, title = _a.title, createAt = _a.createAt;
            return React.createElement("li", { key: id, onClick: function () { return history.push("/play/" + id); } },
                title,
                React.createElement("span", { className: style.timestamp }, dateFormat(createAt, 'yyyy-mm-dd')));
        })));
}
exports.Dashboard = Dashboard;
//# sourceMappingURL=index.js.map