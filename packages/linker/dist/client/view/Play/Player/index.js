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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _client_util_1 = require("@client-util");
var _client_context_1 = require("@client-context");
var React = require("react");
var _common_1 = require("@common");
var _client_component_1 = require("@client-component");
var Play4Player = /** @class */ (function (_super) {
    __extends(Play4Player, _super);
    function Play4Player() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Play4Player.prototype.render = function () {
        var _a = this.props, actor = _a.actor, _b = _a.gameState, playerState = _b.playerState, playUrl = _b.playUrl;
        switch (playerState[actor.token].status) {
            case _common_1.PlayerStatus.playing: {
                window.location.href = playUrl;
                return null;
            }
            case _common_1.PlayerStatus.left: {
                return 'left';
            }
            default: {
                return React.createElement(_client_component_1.Loading, null);
            }
        }
    };
    Play4Player = __decorate([
        _client_util_1.connCtx(_client_context_1.rootContext),
        _client_util_1.connCtx(_client_context_1.playContext)
    ], Play4Player);
    return Play4Player;
}(React.Component));
exports.Play4Player = Play4Player;
//# sourceMappingURL=index.js.map