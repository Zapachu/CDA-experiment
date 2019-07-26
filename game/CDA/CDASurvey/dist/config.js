"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'CDASurvey';
var MoveType;
(function (MoveType) {
    //player
    MoveType["submitSeatNumber"] = "submitSeatNumber";
    MoveType["answerSurvey"] = "answerSurvey";
    MoveType["sendBackPlayer"] = "sendBackPlayer";
    //owner
    MoveType["startMainTest"] = "startMainTest";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
})(PushType = exports.PushType || (exports.PushType = {}));
var FetchRoute;
(function (FetchRoute) {
    FetchRoute["exportXls"] = "/exportXls/:gameId";
})(FetchRoute = exports.FetchRoute || (exports.FetchRoute = {}));
var GameStage;
(function (GameStage) {
    GameStage[GameStage["seatNumber"] = 0] = "seatNumber";
    GameStage[GameStage["mainTest"] = 1] = "mainTest";
})(GameStage = exports.GameStage || (exports.GameStage = {}));
var SheetType;
(function (SheetType) {
    SheetType["result"] = "result";
})(SheetType = exports.SheetType || (exports.SheetType = {}));
var SURVEY_STAGE;
(function (SURVEY_STAGE) {
    SURVEY_STAGE[SURVEY_STAGE["basic"] = 0] = "basic";
    SURVEY_STAGE[SURVEY_STAGE["feedback"] = 1] = "feedback";
    SURVEY_STAGE[SURVEY_STAGE["test"] = 2] = "test";
    SURVEY_STAGE[SURVEY_STAGE["over"] = 3] = "over";
})(SURVEY_STAGE = exports.SURVEY_STAGE || (exports.SURVEY_STAGE = {}));
exports.SURVEY_BASIC = [
    { title: '您的年龄是：' },
    { title: '您的性别：', items: ['男', '女'] },
    { title: '您是否是经济学相关专业？', items: ['是', '否'] },
    { title: '您是否参与过类似的市场实验？', items: ['是', '否'] },
    { title: '您如何评价自己对于拍卖/金融市场的了解？', items: ['非常了解', '基本了解', '不了解'] }
];
exports.SURVEY_FEEDBACK = [
    { title: '您认为在您刚刚参与的市场上有活跃的算法交易者吗？', items: ['有', '没有'] },
    { title: '如果您认为在您刚刚参与的市场上有活跃的算法交易者，您认为市场上一共：', blanks: ['有$__$位买家，其中$__$位算法交易者；', '有$__$位卖家，其中$__$位算法交易者；'] },
    { title: '如果您认为在您刚刚参与的市场上没有活跃的算法交易者，您认为该市场上一共：', blanks: ['有$__$位买家；', '有$__$位卖家；'] },
    { title: '如果您认为在您刚刚参与的市场上有活跃的算法交易者，请您简要描述算法交易者的交易策略？', index: 5 },
    { title: '如果如果您认为在您刚刚参与的市场上没有活跃的算法交易者，请您简要描述其他交易者的交易策略？', index: 3 }
];
exports.SURVEY_TEST = [
    { title: '我时常注意到其他人不会留意的小声音', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '当我在阅读故事时， 我觉得很难理解故事人物的想法或动机', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '我可以轻易地了解别人跟我说话时背后的含义', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '我常把注意力放在事物的整体多过于细节上', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '我能意识到别人对我所说的话是否感到闷了', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '我觉得同时进行多项任务是容易的', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '我可以容易地凭别人的表情来理解他人的想法和情感', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '如果我在做事时被干扰了， 可以很快地回头做原先做的事', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '我喜欢网罗或收集某种资讯（例如：车类，鸟类，火车类，植物类等）', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] },
    { title: '我很难理解别人的动机或想法', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意'] }
];
