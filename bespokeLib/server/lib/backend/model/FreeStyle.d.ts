import { Document, Model } from 'mongoose';
import { IFreeStyle } from '@bespoke/share';
export interface FreeStyleDoc extends IFreeStyle, Document {
}
export declare const FreeStyleModel: Model<FreeStyleDoc, {}>;
