'use strict'

const mongoose = require('mongoose')
const bcrypt   = require('bcrypt-nodejs')
const Schema   = mongoose.Schema
const ObjectId = Schema.ObjectId

const User = new mongoose.Schema({
    createAt: Date,
    updateAt: Date,

    role: {type: Number, default: 0},       // 角色: 0学生 1老师
    name:     {type: String},               // 姓名 真实
    password: {type: String},               // 密码
    mobile:   {type: String, unique: true}, // 手机号(11位)
    email:    {type: String},               // 用户邮箱
    stuNum:   {type: String},               // 用户学号(学生)
    status:   {type: Number, default: 0},   // 0-正常 1-已删除 2-关闭消息通知

    gender:   {type: String},                // 性别: 0男 1女
    headimg:  String,                        // 头像url

    orgCode:  String,                        // 组织 code
    orgName:  String,                        // 存Organization name

    wallet: {type: ObjectId, ref: 'Wallet'}, // 账户钱包

    // 身份证相关
    icName: {type: String},
    icNumber: {type: String},

    //微校相关
    wxmedia: String,

    // 微信相关
    wxname: String, // 微信nickname
    wxOpenId:       {type: String},
    wxUnionId:      {type: String},
    wxprovince:     String,
    wxcity:         String,
    wxcountry:      String,
    wxSubscribe:    {type: Number, default: 1},  // 关注 1关注  0 未关注

    permissionRole: {type: ObjectId, ref: 'PermissionRole'}, //管理后台角色

    lastLogin: {type: Date}  //记录上次登录时间
})

User.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        this.createAt = this.updateAt = Date.now()
        if (!user.mobile) {
            user.mobile = "null" + Date.now() + "" + Math.floor(Math.random() * 10000)
        }
        bcrypt.genSalt(5, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) {
                    return next(err)
                }
                user.password = hash
                next()
            })
        })
    } else {
        this.updateAt = Date.now()
        next()
    }
})

User.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err)
            }
            cb(null, isMatch)
        })
    }
}
User.virtual('phone').get(function() {
    if (!this.mobile || this.mobile.indexOf("null") === 0) {
        return undefined
    }
    return this.mobile
})

export {User}