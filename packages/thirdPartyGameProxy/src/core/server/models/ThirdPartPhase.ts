'use strict'

import {Schema, model, Document} from 'mongoose'

interface PlayHash extends Document{
    result?: string;
    hash?: string;
    player?: string;
    screen?: string;
    referer?: string;
    ipAddress?: string;
    userAgent?: string;
    userSystem?:string;
    userSystemVersion?:string;
}

interface IThirdPartPhaseSchema extends Document{
    elfGameId: string;
    namespace: string;
    param: string;
    playHash: Array<PlayHash>;
    playerUrl: string;
    ownerToken: string;
}

const ThirdPartPhaseSchema = new Schema({
    elfGameId: String,            // elf player elfGameId
    namespace: String,          // elf namespace, ex: oTree, qualtrics, wjx
    param: String,              // oTree param
    playHash: [                 // third party game <=> elf player
        {
            hash: String,       // third party play url or hash
            player: String,     // elf player id
            screen: String,     // player's equipment of screen report
            result: String,     // player's score
            referer: String,    // player's referer
            ipAddress: String,  // player's ip address
            userAgent: String,  // player's user agent
            userSystem: String,         // player's system
            userSystemVersion: String,  // player's system version
        }
    ],
    playUrl: String,            // play url
    ownerToken: String,         // token
})

export const ThirdPartPhase = model<IThirdPartPhaseSchema>('ThirdPartPhase', ThirdPartPhaseSchema)
