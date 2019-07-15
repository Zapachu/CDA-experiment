'use strict';
exports.__esModule = true;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = new mongoose.Schema({
    createAt: Date,
    updateAt: Date,
    role: { type: Number, "default": 0 },
    name: { type: String },
    password: { type: String },
    mobile: { type: String, unique: true },
    email: { type: String },
    stuNum: { type: String },
    status: { type: Number, "default": 0 },
    gender: { type: String },
    headimg: String,
    orgCode: String,
    orgName: String,
    wallet: { type: ObjectId, ref: 'Wallet' },
    // 身份证相关
    icName: { type: String },
    icNumber: { type: String },
    //微校相关
    wxmedia: String,
    // 微信相关
    wxname: String,
    wxOpenId: { type: String },
    wxUnionId: { type: String },
    wxprovince: String,
    wxcity: String,
    wxcountry: String,
    wxSubscribe: { type: Number, "default": 1 },
    permissionRole: { type: ObjectId, ref: 'PermissionRole' },
    lastLogin: { type: Date } //记录上次登录时间
});
exports.User = User;
User.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        this.createAt = this.updateAt = Date.now();
        if (!user.mobile) {
            user.mobile = "null" + Date.now() + "" + Math.floor(Math.random() * 10000);
        }
        bcrypt.genSalt(5, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else {
        this.updateAt = Date.now();
        next();
    }
});
User.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    }
};
User.virtual('phone').get(function () {
    if (!this.mobile || this.mobile.indexOf("null") === 0) {
        return undefined;
    }
    return this.mobile;
});
