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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var style = require("./style.scss");
var share_1 = require("@bespoke/share");
var component_1 = require("@elf/component");
var util_1 = require("../util");
var Login = /** @class */ (function (_super) {
    __extends(Login, _super);
    function Login() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lang = component_1.Lang.extractLang({
            title: ['你的 { 课研助手 } ', 'Your { Experiment Assistant }'],
            mobileNumber: ['手机号', 'Mobile Number'],
            getVerifyCode: ['获取验证码', 'get verify code'],
            verifyCode: ['验证码', 'Verify Code'],
            login: ['登录', 'login'],
            invalidMobileNumber: ['手机号格式有误', 'Invalid mobile number'],
            accountNotExist: ['账号不存在', 'Account not exist'],
            failed2getVcode: ['验证码发送失败', 'Failed to send verify code'],
            loginFailed: ['登录失败', 'Login Failed']
        });
        _this.state = {
            nationCode: share_1.baseEnum.NationCode.China,
            mobileNumber: '',
            verifyCode: '',
            counter: 0
        };
        return _this;
    }
    Login.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util_1.Api.getUser()];
                    case 1:
                        user = (_a.sent()).user;
                        if (user) {
                            this.props.history.push('/dashboard');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Login.prototype, "mobileNumberValid", {
        get: function () {
            var _a = this.state, nationCode = _a.nationCode, mobileNumber = _a.mobileNumber;
            var result = true;
            if (!mobileNumber) {
                result = false;
            }
            switch (nationCode) {
                case 86: {
                    result = !!mobileNumber.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
                    break;
                }
            }
            if (!result) {
                component_1.Toast.warn(this.lang.invalidMobileNumber);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Login.prototype.getVerifyCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, nationCode, mobileNumber, res;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.mobileNumberValid) {
                            return [2 /*return*/];
                        }
                        _a = this.state, nationCode = _a.nationCode, mobileNumber = _a.mobileNumber;
                        return [4 /*yield*/, util_1.Api.getVerifyCode(nationCode, mobileNumber)];
                    case 1:
                        res = _b.sent();
                        switch (res.code) {
                            case share_1.baseEnum.ResponseCode.success: {
                                return [2 /*return*/, this.setState({ counter: share_1.config.vcodeLifetime }, function () { return _this.countDown(); })];
                            }
                            case share_1.baseEnum.ResponseCode.notFound: {
                                return [2 /*return*/, component_1.Toast.warn(this.lang.accountNotExist)];
                            }
                            default: {
                                component_1.Toast.warn(res.msg || this.lang.failed2getVcode);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Login.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, nationCode, mobileNumber, verifyCode, _b, code, returnToUrl;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.state, nationCode = _a.nationCode, mobileNumber = _a.mobileNumber, verifyCode = _a.verifyCode;
                        if (!this.mobileNumberValid || !verifyCode.match(/^\d{6}$/)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, util_1.Api.login(nationCode, mobileNumber, verifyCode)];
                    case 1:
                        _b = _c.sent(), code = _b.code, returnToUrl = _b.returnToUrl;
                        if (code === share_1.baseEnum.ResponseCode.success) {
                            location.href = returnToUrl || location.href;
                        }
                        else {
                            component_1.Toast.warn(this.lang.loginFailed);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Login.prototype.countDown = function () {
        var _this = this;
        var counter = this.state.counter;
        if (!counter) {
            return;
        }
        this.setState({
            counter: counter - 1
        });
        setTimeout(function () { return _this.countDown(); }, 1000);
    };
    Login.prototype.render = function () {
        var _this = this;
        var _a = this, lang = _a.lang, _b = _a.state, nationCode = _b.nationCode, mobileNumber = _b.mobileNumber;
        return React.createElement("section", { className: style.Login },
            React.createElement("span", { className: style.title }, lang.title),
            React.createElement("section", { className: style.inputPanel },
                React.createElement("div", { className: style.label }, lang.mobileNumber),
                React.createElement("div", { className: style.mobileNumberWrapper },
                    React.createElement(MobileNumberInput, __assign({}, {
                        nationCode: nationCode,
                        mobileNumber: mobileNumber,
                        changeNationCode: function (nationCode) { return _this.setState({ nationCode: nationCode }); },
                        changeMobileNumber: function (mobileNumber) { return _this.setState({ mobileNumber: mobileNumber }); }
                    }))),
                React.createElement("div", { className: style.label }, lang.verifyCode),
                React.createElement("div", { className: style.verifyCodeWrapper },
                    React.createElement("input", { className: style.verifyCode, type: 'number', value: this.state.verifyCode, onChange: function (_a) {
                            var verifyCode = _a.target.value;
                            return _this.setState({ verifyCode: verifyCode });
                        } }),
                    this.state.counter ?
                        React.createElement("button", { className: style.verifyCodeBtn + " " + style.disabled },
                            this.state.counter,
                            "s") :
                        React.createElement("button", { className: style.verifyCodeBtn, onClick: function () { return _this.getVerifyCode(); } }, lang.getVerifyCode)),
                React.createElement("div", { className: style.loginBtnWrapper },
                    React.createElement("button", { className: style.loginBtn, onClick: function () { return _this.login(); } }, lang.login))));
    };
    return Login;
}(React.Component));
exports.Login = Login;
var MobileNumberInput = /** @class */ (function (_super) {
    __extends(MobileNumberInput, _super);
    function MobileNumberInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            showNationSelector: false
        };
        return _this;
    }
    MobileNumberInput.prototype.render = function () {
        var _this = this;
        var _a = this.props, nationCode = _a.nationCode, mobileNumber = _a.mobileNumber, changeMobileNumber = _a.changeMobileNumber, changeNationCode = _a.changeNationCode;
        return React.createElement("section", { className: style.mobileNumberInput },
            React.createElement("div", { className: style.nationCode, onClick: function () { return _this.setState({ showNationSelector: !_this.state.showNationSelector }); } },
                "+",
                nationCode),
            React.createElement("input", { className: style.mobileNumber, type: 'tel', value: mobileNumber, onChange: function (_a) {
                    var value = _a.target.value;
                    return changeMobileNumber(value);
                } }),
            this.state.showNationSelector &&
                React.createElement("ul", { className: style.nationCodeSelector }, Object.entries(share_1.baseEnum.NationCode).map(function (_a) {
                    var _b = __read(_a, 2), label = _b[0], code = _b[1];
                    return isNaN(Number(code)) ? null :
                        React.createElement("li", { key: label, onClick: function () {
                                changeNationCode(code);
                                _this.setState({ showNationSelector: false });
                            } },
                            React.createElement("span", null, label),
                            React.createElement("span", null,
                                "+",
                                code));
                })));
    };
    return MobileNumberInput;
}(React.Component));
//# sourceMappingURL=index.js.map