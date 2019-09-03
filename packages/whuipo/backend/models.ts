import {Document, model, Schema} from 'mongoose';

interface IDocument extends Document {
  updateAt: number;
  createAt: number;
}

export interface UserDoc extends IDocument {
  iLabXUserName: string
  phaseScore: Array<number>
}

const UserSchema = new Schema({
  createAt: Date,
  updateAt: Date,
  mobile: {type: String, unique: true}, // 手机号(11位)
  iLabXUserName: String,
  phaseScore: {type: Array, default: []}
});

UserSchema.pre<UserDoc>('save', function (next) {
  this.updateAt = Date.now();
  next();
});

export const User = model<UserDoc>('User', UserSchema);


