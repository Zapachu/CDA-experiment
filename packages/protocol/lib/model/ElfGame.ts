import {Schema, model} from 'mongoose'

const ElfGameSchema = new Schema({
    owner: String,
    title: String,
    desc: String,
    phaseConfigs: Object,
    published: {type: Boolean, default: false},
    mode: String,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
}, {minimize: false})

export const ElfGameModel = model('ElfGame', ElfGameSchema)