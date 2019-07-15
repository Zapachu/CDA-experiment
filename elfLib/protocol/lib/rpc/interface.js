"use strict";
exports.__esModule = true;
var Linker;
(function (Linker) {
    var HeartBeat;
    (function (HeartBeat) {
        HeartBeat.intervalSeconds = 10;
        HeartBeat.key = function (namespace) { return "Linker:HeartBeat:" + namespace; };
    })(HeartBeat = Linker.HeartBeat || (Linker.HeartBeat = {}));
    var Create;
    (function (Create) {
        Create.name = function (namespace) { return "Linker:Create:" + namespace; };
    })(Create = Linker.Create || (Linker.Create = {}));
    var Result;
    (function (Result) {
        Result.name = 'Linker:Result';
    })(Result = Linker.Result || (Linker.Result = {}));
})(Linker = exports.Linker || (exports.Linker = {}));
var Trial;
(function (Trial) {
    var Create;
    (function (Create) {
        Create.name = function (namespace) { return "Trial:Create:" + namespace; };
    })(Create = Trial.Create || (Trial.Create = {}));
    var Done;
    (function (Done) {
        Done.name = 'Trial:Done';
    })(Done = Trial.Done || (Trial.Done = {}));
})(Trial = exports.Trial || (exports.Trial = {}));
