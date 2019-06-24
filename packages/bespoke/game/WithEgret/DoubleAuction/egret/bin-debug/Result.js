var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Result = (function (_super) {
    __extends(Result, _super);
    function Result() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.key = GameScene.result;
        return _this;
    }
    Result.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.btnOnceMore.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return IO.emit(MoveType.onceMore, {}, function (lobbyUrl) { return location.href = lobbyUrl; }); }, this);
    };
    Result.prototype.render = function () {
        var rounds = IO.gameState.rounds, playerState = IO.playerState;
        this.tradeHistory.dataProvider = new eui.ArrayCollection(rounds.map(function (_a, i) {
            var shouts = _a.shouts, trades = _a.trades;
            var myTrade = trades.find(function (_a) {
                var reqIndex = _a.reqIndex, resIndex = _a.resIndex;
                return reqIndex === playerState.index || resIndex === playerState.index;
            });
            if (!myTrade) {
                return { round: i + 1 };
            }
            var price = shouts[myTrade.reqIndex].price, privatePrice = playerState.privatePrices[i];
            return {
                round: i + 1,
                price: price,
                profit: (playerState.role === Role.seller ? 1 : -1) * (price - privatePrice)
            };
        }));
    };
    return Result;
}(Scene));
__reflect(Result.prototype, "Result");
