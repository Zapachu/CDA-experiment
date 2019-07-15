"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var style = require("./style.scss");
var react_router_dom_1 = require("react-router-dom");
var antd_1 = require("antd");
exports.Breadcrumb = function (_a) {
    var history = _a.history, links = _a.links;
    return React.createElement("section", { className: style.breadcrumbs }, links.map(function (_a, i) {
        var label = _a.label, to = _a.to;
        return React.createElement(antd_1.Button, { key: i },
            React.createElement(react_router_dom_1.Link, { to: to }, label));
    }));
};
//# sourceMappingURL=index.js.map