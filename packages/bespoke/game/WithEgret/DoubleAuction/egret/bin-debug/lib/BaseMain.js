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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["online"] = "online";
    SocketEvent["move"] = "move";
    SocketEvent["push"] = "push";
    SocketEvent["syncGameState_json"] = "SGJ";
    SocketEvent["syncPlayerState_json"] = "SPJ";
})(SocketEvent || (SocketEvent = {}));
var IO;
(function (IO) {
    var socketClient = io.connect('/', {
        path: location.pathname.replace('egret', 'socket.io'),
        query: location.search.replace('?', '')
    });
    function emit(type, params) {
        socketClient.emit(SocketEvent.move, type, params);
    }
    IO.emit = emit;
    socketClient.on(SocketEvent.syncGameState_json, function (newGameState) { return IO.gameState = newGameState; })
        .on(SocketEvent.syncPlayerState_json, function (newPlayerState) { return IO.playerState = newPlayerState; })
        .on(SocketEvent.push, function (type, params) { return trigger(type, params); })
        .emit(SocketEvent.online);
    var listeners = new Map();
    function getListeners(pushType) {
        return listeners.get(pushType) || [];
    }
    function on(pushType, fn) {
        listeners.set(pushType, getListeners(pushType).concat([fn]));
    }
    function trigger(pushType, params) {
        getListeners(pushType).forEach(function (fn) { return fn(params); });
    }
    IO.showTween = false;
    var renderCallbacks = [];
    function onRender(render) {
        renderCallbacks.push(render);
    }
    IO.onRender = onRender;
    setInterval(function () {
        if (IO.showTween || !IO.playerState || !IO.gameState) {
            return;
        }
        renderCallbacks.forEach(function (render) { return render(); });
    }, 200);
})(IO || (IO = {}));
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        var textField = new egret.TextField();
        textField.y = 300;
        textField.width = 480;
        textField.height = 100;
        textField.textAlign = 'center';
        _this.textField = textField;
        _this.addChild(_this.textField);
        return _this;
    }
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scene.prototype.switchState = function (state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        this.invalidateState();
    };
    Scene.prototype.getCurrentState = function () {
        return this._state;
    };
    Scene.prototype.childrenCreated = function () {
        var _this = this;
        IO.onRender(function () { return _this.render(); });
    };
    Scene.prototype.render = function () {
    };
    return Scene;
}(eui.Component));
__reflect(Scene.prototype, "Scene", ["eui.UIComponent", "egret.DisplayObject"]);
var BaseMain = (function (_super) {
    __extends(BaseMain, _super);
    function BaseMain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseMain.prototype.createChildren = function () {
        var _this = this;
        _super.prototype.createChildren.call(this);
        this.scenes = this.sceneClasses.map(function (clazz) { return new clazz(); });
        egret.lifecycle.onPause = function () { return egret.ticker.pause(); };
        egret.lifecycle.onResume = function () { return egret.ticker.resume(); };
        egret.registerImplementation('eui.IAssetAdapter', new AssetAdapter());
        egret.registerImplementation('eui.IThemeAdapter', new ThemeAdapter());
        this.loadResource().then(function () {
            Scene.switchScene = function (sceneKey) {
                if (_this.scene) {
                    if (_this.scene.key === sceneKey) {
                        return;
                    }
                    _this.removeChild(_this.scene);
                }
                var _a = _this.stage, stageWidth = _a.stageWidth, stageHeight = _a.stageHeight;
                var scene = _this.scenes.find(function (_a) {
                    var key = _a.key;
                    return key === sceneKey;
                });
                scene.width = stageWidth;
                scene.height = stageHeight;
                _this.addChild(scene);
                _this.scene = scene;
            };
            IO.onRender(function () { return Scene.switchScene(IO.gameState.scene); });
        });
    };
    BaseMain.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loadingView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig('resource/default.res.json', 'resource/')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) { return new eui.Theme('resource/default.thm.json', _this.stage).addEventListener(eui.UIEvent.COMPLETE, resolve, _this); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup('preload', 0, loadingView)];
                    case 3:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [2 /*return*/];
                }
            });
        });
    };
    return BaseMain;
}(eui.UILayer));
__reflect(BaseMain.prototype, "BaseMain");
