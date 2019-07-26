"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'CardGame';
var GameType;
(function (GameType) {
    GameType[GameType["LeftRight"] = 0] = "LeftRight";
    GameType[GameType["Card"] = 1] = "Card";
})(GameType = exports.GameType || (exports.GameType = {}));
var MoveType;
(function (MoveType) {
    MoveType["getRole"] = "getRole";
    MoveType["submitMove"] = "submitMove";
    MoveType["proceed"] = "proceed";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
})(PushType = exports.PushType || (exports.PushType = {}));
var FetchRoute;
(function (FetchRoute) {
    FetchRoute[FetchRoute["getRobotInputSeqList"] = 0] = "getRobotInputSeqList";
})(FetchRoute = exports.FetchRoute || (exports.FetchRoute = {}));
var Role;
(function (Role) {
    Role[Role["A"] = 0] = "A";
    Role[Role["B"] = 1] = "B";
})(Role = exports.Role || (exports.Role = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["playing"] = 0] = "playing";
    PlayerStatus[PlayerStatus["waiting"] = 1] = "waiting";
    PlayerStatus[PlayerStatus["result"] = 2] = "result";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.cardGame = {
    cards: [
        'Joker',
        'Ace',
        'Two',
        'Three'
    ],
    roleName: (_a = {},
        _a[Role.A] = 'Player1',
        _a[Role.B] = 'Player2',
        _a),
    outcomeMatrix4Player1: [
        [[1, -1], [-1, 1], [-1, 1], [-1, 1]],
        [[-1, 1], [-1, 1], [1, -1], [1, -1]],
        [[-1, 1], [1, -1], [-1, 1], [1, -1]],
        [[-1, 1], [1, -1], [1, -1], [-1, 1]]
    ],
};
exports.LRGame = {
    options: [
        'Left',
        'Right'
    ],
    roleName: (_b = {},
        _b[Role.A] = 'Seeker',
        _b[Role.B] = 'Hider',
        _b),
    outcomeMatrix4Player1: {
        small: [
            [[2.5, -2.5], [0, 0]],
            [[0, 0], [0, 0]]
        ],
        big: [
            [[0, 0], [0, 0]],
            [[0, 0], [2.5, -2.5]]
        ]
    }
};
