"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var util_1 = require("../util");
var component_1 = require("@elf/component");
var component_2 = require("../component");
var antd_1 = require("antd");
var share_1 = require("@elf/share");
var Create = /** @class */ (function (_super) {
    __extends(Create, _super);
    function Create() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lang = component_1.Lang.extractLang({
            title: ['标题', 'Title'],
            desc: ['详情', 'Description'],
            invalidBaseInfo: ['请检查实验标题与描述信息', 'Check game title and description please'],
            start: ['开始', 'Start'],
            end: ['结束', 'End'],
            submit: ['提交', 'SUBMIT'],
            submitFailed: ['提交失败', 'Submit failed'],
            createSuccess: ['创建成功', 'Created successfully']
        });
        _this.state = {
            loading: true,
            title: '',
            desc: '',
            params: {},
            submitable: true
        };
        return _this;
    }
    Create.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, code, jsUrl;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, util_1.Api.getJsUrl(this.props.match.params.namespace)];
                    case 1:
                        _a = _b.sent(), code = _a.code, jsUrl = _a.jsUrl;
                        if (code !== share_1.ResponseCode.success) {
                            return [2 /*return*/];
                        }
                        util_1.loadScript(jsUrl.split(';'), function () {
                            return _this.setState({
                                loading: false
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Create.prototype.handleSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, lang, history, _b, title, desc, params, _c, code, gameId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this, lang = _a.lang, history = _a.props.history, _b = _a.state, title = _b.title, desc = _b.desc, params = _b.params;
                        if (!title || !desc) {
                            return [2 /*return*/, antd_1.message.warn(lang.invalidBaseInfo)];
                        }
                        return [4 /*yield*/, util_1.Api.postNewGame(title, desc, util_1.GameTemplate.getTemplate().namespace, params)];
                    case 1:
                        _c = _d.sent(), code = _c.code, gameId = _c.gameId;
                        if (code === share_1.ResponseCode.success) {
                            antd_1.message.success(lang.createSuccess);
                            history.push("/info/" + gameId);
                        }
                        else {
                            antd_1.message.error(lang.submitFailed);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Create.prototype.updatePhase = function (newParam) {
        this.setState(function (_a) {
            var params = _a.params;
            return ({
                params: __assign({}, params, newParam)
            });
        });
    };
    Create.prototype.render = function () {
        var _this = this;
        var _a = this, lang = _a.lang, _b = _a.state, loading = _b.loading, params = _b.params, title = _b.title, desc = _b.desc, submitable = _b.submitable;
        if (loading) {
            return React.createElement(component_2.Loading, null);
        }
        console.log(util_1.GameTemplate.getTemplate());
        var Create = util_1.GameTemplate.getTemplate().Create;
        return React.createElement("section", { style: {
                maxWidth: '64rem',
                margin: 'auto',
                padding: '1rem 1.5rem',
                background: 'white'
            } },
            React.createElement("br", null),
            React.createElement(antd_1.Input, { value: title, placeholder: lang.title, maxLength: '20', onChange: function (_a) {
                    var title = _a.target.value;
                    return _this.setState({ title: title });
                } }),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(antd_1.Input.TextArea, { value: desc, maxLength: 500, autosize: { minRows: 4, maxRows: 8 }, placeholder: lang.desc, onChange: function (_a) {
                    var desc = _a.target.value;
                    return _this.setState({ desc: desc });
                } }),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(Create, __assign({}, {
                submitable: submitable,
                setSubmitable: function (submitable) { return _this.setState({ submitable: submitable }); },
                params: params,
                setParams: function (params) { return _this.updatePhase(params); }
            })),
            submitable ?
                React.createElement("div", { style: { textAlign: 'center' } },
                    React.createElement(antd_1.Button, { type: 'primary', onClick: function () { return _this.handleSubmit(); } }, lang.submit)) : null);
    };
    return Create;
}(React.Component));
exports.Create = Create;
//# sourceMappingURL=index.js.map