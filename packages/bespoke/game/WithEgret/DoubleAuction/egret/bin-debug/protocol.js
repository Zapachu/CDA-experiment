var namespace = 'EgretDoubleAuction';
var Config = {
    ROUND: 3,
    PREPARE_TIME: 5,
    TRADE_TIME: 120,
    RESULT_TIME: 10,
    PLAYER_NUM: 6
};
var GameScene;
(function (GameScene) {
    GameScene[GameScene["prepare"] = 0] = "prepare";
    GameScene[GameScene["trade"] = 1] = "trade";
    GameScene[GameScene["result"] = 2] = "result";
})(GameScene || (GameScene = {}));
var Role;
(function (Role) {
    Role[Role["seller"] = 0] = "seller";
    Role[Role["buyer"] = 1] = "buyer";
})(Role || (Role = {}));
var MoveType;
(function (MoveType) {
    MoveType["getIndex"] = "getIndex";
    MoveType["shout"] = "shout";
    MoveType["onceMore"] = "onceMore";
})(MoveType || (MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["beginRound"] = 0] = "beginRound";
})(PushType || (PushType = {}));