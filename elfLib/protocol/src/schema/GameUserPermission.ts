'use strict'

import {Schema} from 'mongoose'
const {ObjectId, Date: MongodDate, String: MongodString, Number: MongodNumber} = Schema.Types

const GameUserPermission = new Schema({
    createAt: {type: MongodDate, default: Date.now},
    updateAt: {type: MongodDate, default: Date.now},
    uniKey: {type: MongodString, unique: true}, // gameTemplateId + userId
    userId: {type: ObjectId, ref: 'User'},
    gameTemplateId: {type: ObjectId, ref: 'GameTemplate'},
    name: MongodString, //实验名称
    tags: [MongodString], //大类
    charge: MongodNumber, //付费信息label 0：不可见 1：免费 2：试用 3：专业版 4：定制版
    permitted: MongodNumber, //创建权限 0：不能创建 1：可以创建
})

GameUserPermission.pre('save', function(next){
    (this as any).updateAt = Date.now()
    next()
})

export {GameUserPermission}