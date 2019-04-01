import {Document, Model, model, Schema} from 'mongoose'
import {getModels, PhaseManager} from 'elf-protocol'
import {IGame, IGroupState, IPlayer, IUser} from '@common'

const {String} = Schema.Types

const models = getModels(model)

export type GameDoc = IGame & Document
export const GameModel: Model<GameDoc> = models.ElfGame

export type PlayerDoc = IPlayer & Document
export const PlayerModel: Model<PlayerDoc> = models.ElfPlayer

export type UserDoc = IUser & Document
export const UserModel: Model<UserDoc> = models.User

export type GroupStateDoc = {
    elfGameId: string,
    data: IGroupState
} & Document
export const GroupStateModel: Model<GroupStateDoc> = model('LinkerGroupState', new Schema({
    elfGameId: String,
    data: Object,
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
}, {minimize: false}))

export type PhaseResultDoc = {
    gameId: string
    playerId: string
    phaseName: string
} & PhaseManager.TPhaseResult & Document
export const PhaseResultModel: Model<PhaseResultDoc> = model('LinkerPhaseResult', new Schema({
    gameId: String,
    playerId: String,
    phaseName: String,
    uniKey: String,
    point: String,
    detailIframeUrl: String,
    createAt: {type: Date, default: Date.now}
}))
