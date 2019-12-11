"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GroupDecorator;
(function (GroupDecorator) {
    var GroupMoveType;
    (function (GroupMoveType) {
        GroupMoveType["getGroup"] = "getGroup";
    })(GroupMoveType = GroupDecorator.GroupMoveType || (GroupDecorator.GroupMoveType = {}));
    function groupFrameEmitter(frameEmitter, groupIndex) {
        var f = Object.create(frameEmitter);
        f.emit = function (moveType, params, cb) {
            return frameEmitter.emit(moveType, { groupIndex: groupIndex, params: params }, cb);
        };
        return f;
    }
    GroupDecorator.groupFrameEmitter = groupFrameEmitter;
})(GroupDecorator = exports.GroupDecorator || (exports.GroupDecorator = {}));
var RoundDecorator;
(function (RoundDecorator) {
    var RoundMoveType;
    (function (RoundMoveType) {
        RoundMoveType["guideDone"] = "guideDone";
    })(RoundMoveType = RoundDecorator.RoundMoveType || (RoundDecorator.RoundMoveType = {}));
    var PlayerStatus;
    (function (PlayerStatus) {
        PlayerStatus[PlayerStatus["guide"] = 0] = "guide";
        PlayerStatus[PlayerStatus["round"] = 1] = "round";
        PlayerStatus[PlayerStatus["result"] = 2] = "result";
    })(PlayerStatus = RoundDecorator.PlayerStatus || (RoundDecorator.PlayerStatus = {}));
})(RoundDecorator = exports.RoundDecorator || (exports.RoundDecorator = {}));
