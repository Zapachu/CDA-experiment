import {Schema, Document, Model, model} from 'mongoose'
import {IFreeStyle} from 'bespoke-common'

const {Types:{ObjectId, String}} = Schema

export interface FreeStyleDoc extends IFreeStyle,Document{}

const FreeStyleSchema = new Schema({
    game: ObjectId,
    key: String,
    data: {},
    createAt: {type: Date, default: Date.now},
})

export const FreeStyleModel = <Model<FreeStyleDoc>>model<FreeStyleDoc>('BespokeFreeStyle', FreeStyleSchema)
