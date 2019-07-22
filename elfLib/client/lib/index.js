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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Template;
(function (Template) {
    var Create = /** @class */ (function (_super) {
        __extends(Create, _super);
        function Create() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Create;
    }(React.Component));
    Template.Create = Create;
})(Template = exports.Template || (exports.Template = {}));
function registerOnElf(namespace, gameTemplate) {
    if (window['ElfLinker']) {
        window['ElfLinker'].registerOnElf(namespace, gameTemplate);
    }
}
exports.registerOnElf = registerOnElf;
