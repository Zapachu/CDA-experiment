"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GroupDecorator;
(function (GroupDecorator) {
    var MoveType;
    (function (MoveType) {
        MoveType["getGroup"] = "getGroup";
    })(MoveType = GroupDecorator.MoveType || (GroupDecorator.MoveType = {}));
    var ShowHistory;
    (function (ShowHistory) {
        ShowHistory[ShowHistory["hide"] = 0] = "hide";
        ShowHistory[ShowHistory["selfOnly"] = 1] = "selfOnly";
        ShowHistory[ShowHistory["showAll"] = 2] = "showAll";
    })(ShowHistory = GroupDecorator.ShowHistory || (GroupDecorator.ShowHistory = {}));
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
    var MoveType;
    (function (MoveType) {
        MoveType["guideDone"] = "guideDone";
    })(MoveType = RoundDecorator.MoveType || (RoundDecorator.MoveType = {}));
    var PlayerStatus;
    (function (PlayerStatus) {
        PlayerStatus[PlayerStatus["guide"] = 0] = "guide";
        PlayerStatus[PlayerStatus["round"] = 1] = "round";
        PlayerStatus[PlayerStatus["result"] = 2] = "result";
    })(PlayerStatus = RoundDecorator.PlayerStatus || (RoundDecorator.PlayerStatus = {}));
    function roundFrameEmitter(frameEmitter, roundIndex) {
        var f = Object.create(frameEmitter);
        f.emit = function (moveType, params, cb) {
            return frameEmitter.emit(moveType, { roundIndex: roundIndex, params: params }, cb);
        };
        return f;
    }
    RoundDecorator.roundFrameEmitter = roundFrameEmitter;
})(RoundDecorator = exports.RoundDecorator || (exports.RoundDecorator = {}));
