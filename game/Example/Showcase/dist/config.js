"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 实验命名空间，全局唯一，被用于前后端路由、redisKey等的前缀
 */
exports.namespace = 'Showcase';
/**
 * 前端(玩家、主持人)动作类型
 */
var MoveType;
(function (MoveType) {
})(MoveType = exports.MoveType || (exports.MoveType = {}));
/**
 * 后端推送类型， 仅用于推送倒计时、通知等非重要消息， 前端重连时历史消息将丢失
 */
var PushType;
(function (PushType) {
})(PushType = exports.PushType || (exports.PushType = {}));
