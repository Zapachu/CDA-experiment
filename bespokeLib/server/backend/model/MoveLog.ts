import { Schema, Document, Model, model } from 'mongoose'
import { IMoveLog } from '@bespoke/share'

const {
  Types: { String, Number }
} = Schema

export interface MoveLogDoc extends IMoveLog<any, any, any, any>, Document {}

const MoveLogSchema = new Schema(
  {
    seq: Number,
    gameId: { type: String, index: true },
    token: String,
    type: String,
    params: {},
    gameState: {},
    gameStateChanges: [{}],
    playerStates: {},
    playerStatesChanges: [{}]
  },
  { minimize: false }
)

export const MoveLogModel = <Model<MoveLogDoc>>model<MoveLogDoc>('BespokeMoveLog', MoveLogSchema)
