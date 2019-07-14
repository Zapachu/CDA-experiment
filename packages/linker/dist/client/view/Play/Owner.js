"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var style = require("./style.scss");
var util_1 = require("../../util");
var _common_1 = require("@common");
var react_router_dom_1 = require("react-router-dom");
var antd_1 = require("antd");
var Play4Owner = /** @class */ (function (_super) {
    __extends(Play4Owner, _super);
    function Play4Owner() {
        var _a;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lang = util_1.Lang.extractLang((_a = {
                share: ['分享', 'Share'],
                playerList: ['玩家列表', 'PlayerList'],
                console: ['控制台', 'Console']
            },
            _a[_common_1.PhaseStatus[_common_1.PhaseStatus.playing]] = ['进行中', 'Playing'],
            _a[_common_1.PhaseStatus[_common_1.PhaseStatus.paused]] = ['已暂停', 'Paused'],
            _a[_common_1.PhaseStatus[_common_1.PhaseStatus.closed]] = ['已关闭', 'Closed'],
            _a.playerStatus = ['玩家状态', 'Player Status'],
            _a[_common_1.PlayerStatus[_common_1.PlayerStatus.playing]] = ['进行中', 'Playing'],
            _a[_common_1.PlayerStatus[_common_1.PlayerStatus.left]] = ['已离开', 'Left'],
            _a.point = ['得分', 'Point'],
            _a.uniKey = ['唯一标识', 'UniKey'],
            _a.detail = ['详情', 'Detail'],
            _a.reward = ['奖励', 'Reward'],
            _a));
        return _this;
    }
    Play4Owner.prototype.render = function () {
        var _a = this, _b = _a.props, game = _b.game, gameState = _b.gameState, lang = _a.lang;
        return React.createElement("section", null,
            React.createElement(antd_1.Affix, { style: { position: 'absolute', right: 32, top: 64, zIndex: 1000 } },
                React.createElement(antd_1.Dropdown, { overlay: React.createElement(antd_1.Menu, null,
                        React.createElement(antd_1.Menu.Item, null,
                            React.createElement(react_router_dom_1.Link, { to: "/player/" + game.id }, lang.playerList)),
                        React.createElement(antd_1.Menu.Item, null,
                            React.createElement(react_router_dom_1.Link, { to: "/share/" + game.id }, lang.share))) },
                    React.createElement(antd_1.Button, { type: 'primary', shape: "circle", icon: "bars" }))),
            React.createElement("iframe", { className: style.playIframe, src: gameState.playUrl + "?" + util_1.Lang.key + "=" + util_1.Lang.activeLanguage }));
    };
    return Play4Owner;
}(React.Component));
exports.Play4Owner = Play4Owner;
//# sourceMappingURL=Owner.js.map