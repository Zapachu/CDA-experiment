import {IGroup} from '@common'
import {Schema, Document, model} from 'mongoose'

const {ObjectId, String} = Schema.Types

export interface GroupDoc extends IGroup, Document {
}

const GroupSchema = new Schema({
    gameId: {type: ObjectId, ref: 'ElfGame'},
    owner: String,
    title: String,
    desc: String,
    phaseConfigs: Object
}, {minimize: false})

export const GroupModel = model<GroupDoc>('ElfGroup', GroupSchema)