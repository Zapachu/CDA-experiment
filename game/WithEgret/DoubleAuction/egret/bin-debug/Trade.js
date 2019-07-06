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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var TradeState;
(function (TradeState) {
    TradeState["normal"] = "normal";
    TradeState["input"] = "input";
    TradeState["history"] = "history";
    TradeState["roundOver"] = "roundOver";
})(TradeState || (TradeState = {}));
var Trade = (function (_super) {
    __extends(Trade, _super);
    function Trade() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.key = GameScene.trade;
        return _this;
    }
    Trade.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.priceInput.touchEnabled = true;
        this.btnHistory.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return _this.switchState(TradeState.history); }, this);
        this.btnShout.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return _this.switchState(TradeState.input); }, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return _this.switchState(TradeState.normal); }, this);
        this.priceInput.addEventListener(egret.Event.FOCUS_OUT, function (_a) {
            var text = _a.target.text;
            var price = Number(text);
            var _b = IO.playerState, role = _b.role, privatePrices = _b.privatePrices, roundIndex = IO.gameState.roundIndex, privatePrice = privatePrices[roundIndex], priceInvalid = isNaN(price) || (role === Role.seller && price < privatePrice) || (role === Role.buyer && price > privatePrice);
            if (priceInvalid) {
                console.warn('输入有误 ： ', text);
                return;
            }
            IO.emit(MoveType.shout, { price: price });
            _this.switchState(TradeState.normal);
        }, this);
    };
    Trade.prototype.render = function () {
        var _a = IO.gameState, rounds = _a.rounds, roundIndex = _a.roundIndex, playerState = IO.playerState, _b = rounds[roundIndex], time = _b.time, shouts = _b.shouts, timeLeft = Config.TRADE_TIME - time, myShout = shouts[playerState.index];
        this.privatePrice.text = playerState.privatePrices[roundIndex].toString();
        this.tip.text = "\u60A8\u7684\u89D2\u8272\u4E3A : " + (playerState.role === Role.seller ? '卖家' : '买家') + (myShout && myShout.traded ? ',交易成功' : '');
        this.btnShout.enabled = !(myShout && myShout.traded);
        this.conditionTip.text = playerState.role === Role.seller ? '高于' : '低于';
        this.totalRound.text = Config.ROUND.toString();
        this.curRound.text = (roundIndex + 1).toString();
        this.countDown.text = timeLeft.toString();
        this.roundOverTime.text = (Config.RESULT_TIME + timeLeft).toString();
        this.buyPrices.itemRenderer = ShoutItem;
        this.sellPrices.itemRenderer = ShoutItem;
        var shoutsWithState = shouts.map(function (shout, i) { return (__assign({}, shout, { state: i === playerState.index ?
                playerState.role === Role.seller ?
                    ShoutItemState.sell :
                    ShoutItemState.buy :
                ShoutItemState.normal })); }).filter(function (_a) {
            var traded = _a.traded;
            return !traded;
        });
        this.buyPrices.dataProvider = new eui.ArrayCollection(shoutsWithState.filter(function (_a) {
            var role = _a.role;
            return role === Role.buyer;
        }));
        this.sellPrices.dataProvider = new eui.ArrayCollection(shoutsWithState.filter(function (_a) {
            var role = _a.role;
            return role === Role.seller;
        }));
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
        if (timeLeft < 0) {
            this.switchState(TradeState.roundOver);
        }
        else if (this._state === TradeState.roundOver) {
            this.switchState(TradeState.normal);
        }
    };
    return Trade;
}(Scene));
__reflect(Trade.prototype, "Trade");
var ShoutItemState;
(function (ShoutItemState) {
    ShoutItemState["normal"] = "normal";
    ShoutItemState["buy"] = "buy";
    ShoutItemState["sell"] = "sell";
})(ShoutItemState || (ShoutItemState = {}));
var ShoutItem = (function (_super) {
    __extends(ShoutItem, _super);
    function ShoutItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShoutItem.prototype.dataChanged = function () {
        this.innerContent.data = this.data;
        this.innerContent.currentState = this.data.state;
    };
    return ShoutItem;
}(eui.ItemRenderer));
__reflect(ShoutItem.prototype, "ShoutItem");
