"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=index.js.map