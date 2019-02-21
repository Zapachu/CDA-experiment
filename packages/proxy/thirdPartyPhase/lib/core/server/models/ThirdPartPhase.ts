'use strict'

import {Schema, model} from 'mongoose'

const {String: MongodString, Boolean: MongodBoolean} = Schema.Types

const ThirdPartPhaseSchema = new Schema({
    groupId: MongodString,
    // namespace: otree/qualtrics/wjx
    namespace: MongodString,
    param: MongodString,
    playHashs: [
        {
            hash: MongodString,
            player: MongodString
        }
    ],
    adminUrl: MongodString,
    prefixUrl: MongodString,
    playUrl: MongodString,

    ownerToken: MongodString,  // token
})

export const ThirdPartPhase = model('ThirdPartPhase', ThirdPartPhaseSchema)
