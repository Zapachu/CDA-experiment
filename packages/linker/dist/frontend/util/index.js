"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linker_share_1 = require("linker-share");
var Api_1 = require("./Api");
exports.Api = Api_1.Api;
var fileLoader_1 = require("./fileLoader");
exports.loadScript = fileLoader_1.loadScript;
var GameTemplate;
(function (GameTemplate) {
    var gameTemplate;
    function setTemplate(template) {
        gameTemplate = template;
    }
    GameTemplate.setTemplate = setTemplate;
    function getTemplate() {
        return gameTemplate;
    }
    GameTemplate.getTemplate = getTemplate;
})(GameTemplate = exports.GameTemplate || (exports.GameTemplate = {}));
function toV5(route) {
    window.open("" + linker_share_1.config.academus.route.prefix + route, '_blank');
}
exports.toV5 = toV5;
//# sourceMappingURL=index.js.map