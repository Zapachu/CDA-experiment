'use strict'

import {Schema} from 'mongoose'
const {Date: MongodDate, Number: MongodNumber, String: MongodString} = Schema.Types

const GameTemplate = new Schema({
    createAt: {type: MongodDate, default: Date.now},
    updateAt: {type: MongodDate, default: Date.now},
    id: MongodNumber, //实验类型 经典实验才有id
    code: MongodString, //实验类别 baseEnum.GAME_TYPE
    name: MongodString, //实验名称
    tags: [MongodString], //大类
    namespace: MongodString, //实验路径
    charge: {type: MongodNumber, default: 0}, //付费信息label enums.gameCharge
    permitted: {type: MongodNumber, default: 0}, //创建权限 0：不能创建 1：可以创建
    chargeFree: {type: MongodNumber, default: 0}, //针对免费版的付费信息label
    permittedFree: {type: MongodNumber, default: 0}, //针对免费版的创建权限
    chargePro: {type: MongodNumber, default: 0}, //针对专业版的付费信息label
    permittedPro: {type: MongodNumber, default: 0}, //针对专业版的创建权限
    status: {type: MongodNumber, default: 1}, //状态 0：不正常 1：正常
})

GameTemplate.pre('save', function(next){
    (this as any).updateAt = Date.now()
    next()
})
export {GameTemplate}