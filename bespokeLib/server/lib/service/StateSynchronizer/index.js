"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var share_1 = require("@bespoke/share");
var util_1 = require("@elf/util");
var BaseSynchronizer_1 = require("./BaseSynchronizer");
exports.GameStateSynchronizer = BaseSynchronizer_1.GameStateSynchronizer;
exports.PlayerStateSynchronizer = BaseSynchronizer_1.PlayerStateSynchronizer;
var DiffSynchronizer_1 = require("./DiffSynchronizer");
var UNSUPPORTED_STRATEGY_WARNING = 'Unsupported State Synchronize Strategy';
var StateSynchronizer = /** @class */ (function () {
    function StateSynchronizer(strategy, controller) {
        this.strategy = strategy;
        this.controller = controller;
    }
    StateSynchronizer.prototype.getGameStateSynchronizer = function () {
        switch (this.strategy) {
            case share_1.SyncStrategy.default:
                return new BaseSynchronizer_1.GameStateSynchronizer(this.controller);
            case share_1.SyncStrategy.diff:
                return new DiffSynchronizer_1.DiffGameStateSynchronizer(this.controller);
            default:
                util_1.Log.w(UNSUPPORTED_STRATEGY_WARNING);
        }
    };
    StateSynchronizer.prototype.getPlayerStateSynchronizer = function (actor) {
        switch (this.strategy) {
            case share_1.SyncStrategy.default:
                return new BaseSynchronizer_1.PlayerStateSynchronizer(actor, this.controller);
            case share_1.SyncStrategy.diff:
                return new DiffSynchronizer_1.DiffPlayerStateSynchronizer(actor, this.controller);
            default:
                util_1.Log.w(UNSUPPORTED_STRATEGY_WARNING);
        }
    };
    return StateSynchronizer;
}());
exports.StateSynchronizer = StateSynchronizer;
