import { Schema, model } from 'mongoose';
const { ObjectId } = Schema.Types;
import { UserDoc } from './interface';

const UserSchema = new Schema({
  createAt: Date,
  updateAt: Date,

  role: { type: Number, default: 0 }, // 角色: 0学生 1老师
  name: { type: String }, // 姓名 真实
  password: { type: String }, // 密码
  mobile: { type: String, unique: true }, // 手机号(11位)
  email: { type: String }, // 用户邮箱
  stuNum: { type: String }, // 用户学号(学生)
  status: { type: Number, default: 0 }, // 0-正常 1-已删除 2-关闭消息通知

  gender: { type: String }, // 性别: 0男 1女
  headimg: String, // 头像url

  orgCode: String, // 组织 code
  orgName: String, // 存Organization name

  wallet: { type: ObjectId, ref: 'Wallet' }, // 账户钱包

  // 身份证相关
  icName: { type: String },
  icNumber: { type: String },

  //微校相关
  wxmedia: String,

  // 微信相关
  wxname: String, // 微信nickname
  wxOpenId: { type: String },
  wxUnionId: { type: String },
  wxprovince: String,
  wxcity: String,
  wxcountry: String,
  wxSubscribe: { type: Number, default: 1 }, // 关注 1关注  0 未关注

  permissionRole: { type: ObjectId, ref: 'PermissionRole' }, //管理后台角色

  lastLogin: { type: Date }, //记录上次登录时间

  birth: Date, //出生日期
});


export default model<UserDoc>('User', UserSchema);
