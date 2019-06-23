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
var PrepareState;
(function (PrepareState) {
    PrepareState["normal"] = "normal";
    PrepareState["match"] = "match";
})(PrepareState || (PrepareState = {}));
var Prepare = (function (_super) {
    __extends(Prepare, _super);
    function Prepare() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.key = GameScene.prepare;
        _this.i = 1;
        return _this;
    }
    Prepare.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        IO.emit(MoveType.getIndex);
    };
    Prepare.prototype.render = function () {
        var _a = IO.gameState, prepareTime = _a.prepareTime, playerIndex = _a.playerIndex;
        this.countDown.text = (PREPARE_TIME - prepareTime).toString();
        this.waitLabel.text = "\u7B49\u5F85\u5176\u5B83\u73A9\u5BB6\u52A0\u5165(" + playerIndex + "/" + PLAYER_NUM + ")" + '...   '.substr(3 - (this.i++) % 4, 3);
        if (IO.gameState.prepareTime) {
            this.switchState(PrepareState.match);
        }
    };
    return Prepare;
}(Scene));
__reflect(Prepare.prototype, "Prepare");
