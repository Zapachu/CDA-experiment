import { IGame, ISimulatePlayer } from '@bespoke/share';
import { Document, Model } from 'mongoose';
export interface GameDoc<ICreateParams> extends IGame<ICreateParams>, Document {
    createAt: number;
}
export declare const GameModel: Model<GameDoc<any>, {}>;
export interface SimulatePlayerDoc extends ISimulatePlayer, Document {
}
export declare const SimulatePlayerModel: Model<SimulatePlayerDoc, {}>;
