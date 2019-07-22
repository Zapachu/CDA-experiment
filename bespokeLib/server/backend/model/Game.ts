import {IGame, ISimulatePlayer} from '@bespoke/share'
import {Schema, Document, Model, model} from 'mongoose'

const {Types: {ObjectId, String}} = Schema

//region Game
export interface GameDoc<ICreateParams> extends IGame<ICreateParams>, Document {
    createAt: number
}

const GameSchema = new Schema({
    elfGameId:String,
    title: String,
    namespace: String,
    params: {type: Object, default: ({})},
    owner: {type: ObjectId, ref: 'User'},
    createAt: {type: Date, default: Date.now}
}, {minimize: false})

export const GameModel = <Model<GameDoc<any>>>model<GameDoc<any>>('BespokeGame', GameSchema)
//endregion

//region SimulatePlayer
export interface SimulatePlayerDoc extends ISimulatePlayer, Document {
}

const SimulatePlayer = new Schema({
    gameId: String,
    token: String,
    name: String
})
export const SimulatePlayerModel = <Model<SimulatePlayerDoc>>model<SimulatePlayerDoc>('BespokeSimulatePlayer', SimulatePlayer)
//endregion
