"use strict";
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
var GroupDecorator;
(function (GroupDecorator) {
    var GroupMoveType;
    (function (GroupMoveType) {
        GroupMoveType["getGroup"] = "getGroup";
    })(GroupMoveType = GroupDecorator.GroupMoveType || (GroupDecorator.GroupMoveType = {}));
    function groupFrameEmitter(frameEmitter, groupIndex) {
        var f = Object.create(frameEmitter);
        f.emit = function (moveType, params, cb) { return frameEmitter.emit(moveType, { groupIndex: groupIndex, params: params }, cb); };
        return f;
    }
    GroupDecorator.groupFrameEmitter = groupFrameEmitter;
})(GroupDecorator = exports.GroupDecorator || (exports.GroupDecorator = {}));
