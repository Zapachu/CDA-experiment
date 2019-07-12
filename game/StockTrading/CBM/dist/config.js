"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'StockTrading-CBM';
var ROLE;
(function (ROLE) {
    ROLE[ROLE["Seller"] = 0] = "Seller";
    ROLE[ROLE["Buyer"] = 1] = "Buyer";
})(ROLE = exports.ROLE || (exports.ROLE = {}));
var PeriodStage;
(function (PeriodStage) {
    PeriodStage[PeriodStage["reading"] = 0] = "reading";
    PeriodStage[PeriodStage["trading"] = 1] = "trading";
    PeriodStage[PeriodStage["result"] = 2] = "result";
})(PeriodStage = exports.PeriodStage || (exports.PeriodStage = {}));
var MoveType;
(function (MoveType) {
    MoveType["getIndex"] = "getIndex";
    MoveType["submitOrder"] = "submitOrder";
    MoveType["cancelOrder"] = "cancelOrder";
    MoveType["repayMoney"] = "repayMoney";
    MoveType["repayCount"] = "repayCount";
    MoveType["exitGame"] = "exitGame";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType["countDown"] = "countDown";
    PushType["beginTrading"] = "beginTrading";
    PushType["closeOutWarning"] = "closeOutWarning";
    PushType["closeOut"] = "closeOut";
    PushType["tradeSuccess"] = "tradeSuccess";
})(PushType = exports.PushType || (exports.PushType = {}));
exports.PERIOD = 6;
exports.CONFIG = {
    prepareTime: 5,
    tradeTime: 180,
    resultTime: 30
};
var GameType;
(function (GameType) {
    GameType[GameType["rise"] = 0] = "rise";
    GameType[GameType["fall"] = 1] = "fall";
    GameType[GameType["riseFall"] = 2] = "riseFall";
    GameType[GameType["fallRise"] = 3] = "fallRise";
})(GameType = exports.GameType || (exports.GameType = {}));
exports.PrivatePriceRegion = (_a = {},
    _a[GameType.rise] = [[25, 75], [30, 80], [35, 85], [40, 90], [45, 95], [50, 100]],
    _a[GameType.fall] = [[50, 100], [45, 95], [40, 90], [35, 85], [30, 80], [25, 75]],
    _a[GameType.riseFall] = [[25, 75], [30, 80], [35, 85], [35, 85], [30, 80], [25, 75]],
    _a[GameType.fallRise] = [[35, 85], [30, 80], [25, 75], [25, 75], [30, 80], [35, 85]],
    _a);
var Identity;
(function (Identity) {
    Identity[Identity["retailPlayer"] = 0] = "retailPlayer";
    Identity[Identity["moneyGuarantor"] = 1] = "moneyGuarantor";
    Identity[Identity["stockGuarantor"] = 2] = "stockGuarantor";
})(Identity = exports.Identity || (exports.Identity = {}));
exports.playerLimit = 12;
