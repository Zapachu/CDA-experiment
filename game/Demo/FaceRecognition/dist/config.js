"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'FaceRecognition';
exports.recognizeInterval = 3000;
exports.qiniuTokenLifetime = 7200;
var Gender;
(function (Gender) {
    Gender["male"] = "male";
    Gender["female"] = "female";
})(Gender = exports.Gender || (exports.Gender = {}));
var MoveType;
(function (MoveType) {
    MoveType["getQiniuConfig"] = "getQiniuConfig";
    MoveType["recognize"] = "recognize";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
})(PushType = exports.PushType || (exports.PushType = {}));
