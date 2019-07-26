import { Document, Model } from 'mongoose';
import { IUser } from '@bespoke/share';
export declare type UserDoc = IUser & Document;
export declare const UserModel: Model<UserDoc>;
export * from './Game';
export * from './MoveLog';
export * from './FreeStyle';
