export * from './GameTemplate';
export * from './GameUserPermission';
import { model as mongooseModel, Model } from 'mongoose';
declare const schemas: {
    ElfGame: import("mongoose").Schema<any>;
    ElfPlayer: import("mongoose").Schema<any>;
    User: any;
    GameUserPermission: import("mongoose").Schema<any>;
    GameTemplate: import("mongoose").Schema<any>;
};
declare type TModels = {
    [P in keyof typeof schemas]?: Model<any>;
};
export declare function getModels(model: typeof mongooseModel): TModels;
