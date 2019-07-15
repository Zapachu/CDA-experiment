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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var style = require("./style.scss");
var Keyboard = {
    row0: {
        one: '1',
        two: '2',
        three: '3',
    },
    row1: {
        four: '4',
        five: '5',
        six: '6',
    },
    row2: {
        seven: '7',
        eight: '8',
        nine: '9',
    },
    row3: {
        Back: 'Back',
        zero: '0',
        Del: 'Del'
    }
};
var CodePanel = /** @class */ (function (_super) {
    __extends(CodePanel, _super);
    function CodePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            code: new Array(_this.props.number).fill(''),
            active: 0,
            focus: -1,
            inputValue: null
        };
        _this.handleKeyDown = function (e) {
            var triggerNum = _this.state.code.length - 1;
            var number = parseInt(e.keyCode);
            if (number === 8 || number === 46)
                return _this.del();
            // number : 48 ~ 57, 96 ~ 105
            number = number - 48;
            if (number > 9)
                number = number - 96;
            if (number > 9 || number < 0)
                return;
            var _a = _this.state, code = _a.code, active = _a.active, focus = _a.focus;
            if (focus > -1) {
                code[focus] = number.toString();
                _this.setState({
                    focus: -1,
                    code: __spread(code)
                });
                return;
            }
            code[active] = number.toString();
            if (active === triggerNum) {
                _this.props.onFinish(_this.codeStr);
                _this.setState({
                    code: new Array(_this.props.number).fill(''),
                    active: 0
                });
                return;
            }
            active++;
            _this.setState({ code: code, active: active });
        };
        return _this;
    }
    Object.defineProperty(CodePanel.prototype, "codeStr", {
        get: function () {
            return this.state.code.join('');
        },
        enumerable: true,
        configurable: true
    });
    CodePanel.prototype.componentDidMount = function () {
        var _this = this;
        window.addEventListener("keydown", function (e) { return _this.handleKeyDown(e); });
        window.addEventListener('click', function () { return _this.handleClick(); });
    };
    CodePanel.prototype.componentWillUnmount = function () {
        var _this = this;
        window.removeEventListener('keydown', function (e) { return _this.handleKeyDown(e); });
        window.removeEventListener('click', function () { return _this.handleClick(); });
    };
    CodePanel.prototype.handleClick = function () {
        this.setState({
            focus: -1
        });
    };
    CodePanel.prototype.handleItemClick = function (i, e) {
        var _a = this.state, active = _a.active, focus = _a.focus, code = _a.code;
        if (i >= active || i === focus) {
            return;
        }
        this.setState({
            focus: i,
            inputValue: code[i]
        });
        e.stopPropagation();
    };
    CodePanel.prototype.render = function () {
        var _this = this;
        var _a = this.state, code = _a.code, focus = _a.focus, active = _a.active, inputValue = _a.inputValue;
        return React.createElement("section", { className: style.codePanel },
            React.createElement("div", { className: style.password }, code.map(function (c, i) { return React.createElement("span", { key: i, className: i >= active ? style.disabledClick : '', onClick: function (e) { return _this.handleItemClick(i, e); } }, focus === i ?
                React.createElement("input", { key: 'input' + i, ref: function (input) { return input && input.focus(); }, className: style.focusInput, value: inputValue }) : c); })),
            React.createElement("div", { className: style.inputPanel, onClick: function (e) { return e.stopPropagation(); } }, Object.entries(Keyboard).map(function (_a) {
                var _b = __read(_a, 2), row = _b[0], keys = _b[1];
                return React.createElement("div", { key: row }, Object.values(keys).map(function (v) {
                    return React.createElement("span", { key: v, className: style.inputKey, onClick: function () { return _this.setCode(v); } }, v);
                }));
            })));
    };
    CodePanel.prototype.setCode = function (key) {
        var triggerNum = this.state.code.length - 1;
        if (key === Keyboard.row3.Back) {
            this.props.goBack();
            return;
        }
        if (key === Keyboard.row3.Del) {
            return this.del();
        }
        var _a = this.state, code = _a.code, active = _a.active, focus = _a.focus;
        if (focus > -1) {
            code[focus] = key;
            this.setState({
                focus: -1,
                code: __spread(code)
            });
        }
        else {
            code[active] = key;
            if (active === triggerNum) {
                this.props.onFinish(this.codeStr);
                this.setState({
                    active: 0,
                    code: new Array(this.props.number).fill('')
                });
                return false;
            }
            active++;
            this.setState({
                code: code,
                active: active
            });
        }
    };
    CodePanel.prototype.del = function () {
        var _a = this.state, code = _a.code, active = _a.active, focus = _a.focus;
        if (focus > -1) {
            this.setState({
                inputValue: null
            });
            return;
        }
        if (code[0] !== null) {
            code[active - 1] = null;
            this.setState(function (prevState) { return ({
                active: prevState.active - 1,
                code: __spread(code)
            }); });
        }
    };
    return CodePanel;
}(React.Component));
exports.CodePanel = CodePanel;
//# sourceMappingURL=index.js.map