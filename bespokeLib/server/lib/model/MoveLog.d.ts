import { Document, Model } from 'mongoose';
import { IMoveLog } from '@bespoke/share';
export interface MoveLogDoc extends IMoveLog<any, any, any, any>, Document {
}
export declare const MoveLogModel: Model<MoveLogDoc, {}>;
