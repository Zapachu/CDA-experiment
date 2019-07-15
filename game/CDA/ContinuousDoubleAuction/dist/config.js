"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'ContinuousDoubleAuction';
var ROLE;
(function (ROLE) {
    ROLE[ROLE["Seller"] = 0] = "Seller";
    ROLE[ROLE["Buyer"] = 1] = "Buyer";
})(ROLE = exports.ROLE || (exports.ROLE = {}));
var IDENTITY;
(function (IDENTITY) {
    IDENTITY[IDENTITY["Player"] = 0] = "Player";
    IDENTITY[IDENTITY["ZipRobot"] = 1] = "ZipRobot";
    IDENTITY[IDENTITY["GDRobot"] = 2] = "GDRobot";
})(IDENTITY = exports.IDENTITY || (exports.IDENTITY = {}));
var AdjustDirection;
(function (AdjustDirection) {
    AdjustDirection[AdjustDirection["raise"] = 0] = "raise";
    AdjustDirection[AdjustDirection["lower"] = 1] = "lower";
})(AdjustDirection = exports.AdjustDirection || (exports.AdjustDirection = {}));
var TRADE;
(function (TRADE) {
    TRADE[TRADE["success"] = 1] = "success";
})(TRADE = exports.TRADE || (exports.TRADE = {}));
var TRADE_TYPE;
(function (TRADE_TYPE) {
    TRADE_TYPE[TRADE_TYPE["buyerFirst"] = 1] = "buyerFirst";
    TRADE_TYPE[TRADE_TYPE["sellerFirst"] = 2] = "sellerFirst";
})(TRADE_TYPE = exports.TRADE_TYPE || (exports.TRADE_TYPE = {}));
var EVENT_TYPE;
(function (EVENT_TYPE) {
    EVENT_TYPE[EVENT_TYPE["rejected"] = 1] = "rejected";
    EVENT_TYPE[EVENT_TYPE["entered"] = 2] = "entered";
    EVENT_TYPE[EVENT_TYPE["traded"] = 3] = "traded";
    EVENT_TYPE[EVENT_TYPE["cancelled"] = 4] = "cancelled";
})(EVENT_TYPE = exports.EVENT_TYPE || (exports.EVENT_TYPE = {}));
exports.orderNumberLimit = 10000;
var SheetType;
(function (SheetType) {
    SheetType["seatNumber"] = "seatNumber";
    SheetType["result"] = "result";
    SheetType["log"] = "log";
    SheetType["profit"] = "profit";
    SheetType["robotCalcLog"] = "robotCalcLog";
    SheetType["robotSubmitLog"] = "robotSubmitLog";
})(SheetType = exports.SheetType || (exports.SheetType = {}));
var MarketStage;
(function (MarketStage) {
    MarketStage[MarketStage["notOpen"] = 0] = "notOpen";
    MarketStage[MarketStage["readDescription"] = 1] = "readDescription";
    MarketStage[MarketStage["trading"] = 2] = "trading";
    MarketStage[MarketStage["result"] = 3] = "result";
})(MarketStage = exports.MarketStage || (exports.MarketStage = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["wait4Position"] = 0] = "wait4Position";
    PlayerStatus[PlayerStatus["wait4MarketOpen"] = 1] = "wait4MarketOpen";
    PlayerStatus[PlayerStatus["trading"] = 2] = "trading";
    PlayerStatus[PlayerStatus["left"] = 3] = "left";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
var ShoutResult;
(function (ShoutResult) {
    ShoutResult[ShoutResult["shoutSuccess"] = 0] = "shoutSuccess";
    ShoutResult[ShoutResult["tradeSuccess"] = 1] = "tradeSuccess";
    ShoutResult[ShoutResult["marketReject"] = 2] = "marketReject";
    ShoutResult[ShoutResult["shoutOnTradedUnit"] = 3] = "shoutOnTradedUnit";
})(ShoutResult = exports.ShoutResult || (exports.ShoutResult = {}));
var DBKey;
(function (DBKey) {
    DBKey["moveEvent"] = "moveEvent";
    DBKey["robotCalcLog"] = "robotCalcLog";
    DBKey["robotSubmitLog"] = "robotSubmitLog";
    DBKey["seatNumber"] = "seatNumber";
})(DBKey = exports.DBKey || (exports.DBKey = {}));
exports.RedisKey = {
    robotActionSeq: function (gameId) { return "robotCalcSeq:" + gameId; }
};
exports.phaseNames = {
    assignPosition: 'assignPosition',
    mainGame: 'mainGame',
    marketResult: 'marketResult',
};
var MoveType;
(function (MoveType) {
    //player
    MoveType["enterMarket"] = "enterMarket";
    MoveType["submitOrder"] = "submitOrder";
    MoveType["rejectOrder"] = "rejectOrder";
    MoveType["cancelOrder"] = "cancelOrder";
    //owner
    MoveType["assignPosition"] = "assignPosition";
    MoveType["openMarket"] = "openMarket";
    //elf
    MoveType["sendBackPlayer"] = "sendBackPlayer";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType["assignedPosition"] = "assignedPosition";
    PushType["periodCountDown"] = "periodCountDown";
    PushType["periodOpen"] = "periodOpen";
    PushType["newOrder"] = "newOrder";
    PushType["newTrade"] = "newTrade";
})(PushType = exports.PushType || (exports.PushType = {}));
var FetchRoute;
(function (FetchRoute) {
    FetchRoute["exportXls"] = "/exportXls/:gameId";
})(FetchRoute = exports.FetchRoute || (exports.FetchRoute = {}));
var ReactionType;
(function (ReactionType) {
    ReactionType[ReactionType["TradeAndOrder"] = 0] = "TradeAndOrder";
    ReactionType[ReactionType["TradeOnly"] = 1] = "TradeOnly";
})(ReactionType = exports.ReactionType || (exports.ReactionType = {}));
