"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var style = require("./style.scss");
var util_1 = require("../../util");
exports.Loading = function (_a) {
    var label = _a.label;
    return React.createElement("section", { className: style.loadingWrapper },
        React.createElement("div", { className: style.bounceWrapper },
            React.createElement("span", { className: style.bounce }),
            React.createElement("span", { className: style.bounce })),
        React.createElement("label", { className: style.label }, label || util_1.Lang.extractLang({ label: ['加载中', 'Loading'] }).label));
};
//# sourceMappingURL=index.js.map