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
exports.GroupRange = {
    group: {
        min: 1,
        max: 8
    },
    groupSize: {
        min: 1,
        max: 12
    }
};
var Wrapper;
(function (Wrapper) {
    var GroupMoveType;
    (function (GroupMoveType) {
        GroupMoveType["getGroup"] = "getGroup";
    })(GroupMoveType = Wrapper.GroupMoveType || (Wrapper.GroupMoveType = {}));
})(Wrapper = exports.Wrapper || (exports.Wrapper = {}));
var Extractor;
(function (Extractor) {
    function game(game, groupIndex) {
        var params = game.params, extraGame = __rest(game, ["params"]);
        return __assign(__assign({}, extraGame), params[groupIndex]);
    }
    Extractor.game = game;
    function frameEmitter(frameEmitter, groupIndex) {
        var f = Object.create(frameEmitter);
        f.emit = function (moveType, params, cb) { return frameEmitter.emit(moveType, { groupIndex: groupIndex, params: params }, cb); };
        return f;
    }
    Extractor.frameEmitter = frameEmitter;
    function gameState(gameState, groupIndex) {
        var groups = gameState.groups, extraGameState = __rest(gameState, ["groups"]);
        return __assign(__assign({}, groups[groupIndex].state), extraGameState);
    }
    Extractor.gameState = gameState;
    function playerState(playerState) {
        return playerState;
    }
    Extractor.playerState = playerState;
    function playerStates(playerStates, groupIndex) {
        var r = {};
        Object.values(playerStates).forEach(function (playerState) {
            if (playerState.groupIndex !== groupIndex) {
                return;
            }
            r[playerState.actor.token] = Extractor.playerState(playerState);
        });
        return r;
    }
    Extractor.playerStates = playerStates;
})(Extractor = exports.Extractor || (exports.Extractor = {}));
