"use strict";
exports.__esModule = true;
//region Elf
var PhaseReg;
(function (PhaseReg) {
    PhaseReg.intervalSeconds = 10;
    PhaseReg.key = function (namespace) { return "Elf:PhaseReg:" + namespace; };
})(PhaseReg = exports.PhaseReg || (exports.PhaseReg = {}));
var NewPhase;
(function (NewPhase) {
    NewPhase.name = function (namespace) { return "Elf:NewPhase:" + namespace; };
})(NewPhase = exports.NewPhase || (exports.NewPhase = {}));
var SetPlayerResult;
(function (SetPlayerResult) {
    SetPlayerResult.name = 'Elf:SetPlayerResult';
})(SetPlayerResult = exports.SetPlayerResult || (exports.SetPlayerResult = {}));
//endregion
//region Trial
var CreateGame;
(function (CreateGame) {
    CreateGame.name = function (namespace) { return "Trial:" + namespace + ":CreateGame"; };
    CreateGame.playerLimit = 12;
})(CreateGame = exports.CreateGame || (exports.CreateGame = {}));
var GameOver;
(function (GameOver) {
    GameOver.name = 'Trial:GameOver';
})(GameOver = exports.GameOver || (exports.GameOver = {}));
//endregion
