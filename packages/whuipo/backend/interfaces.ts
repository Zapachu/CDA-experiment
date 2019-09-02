import { Document } from 'mongoose'
interface IDocument extends Document {
    updateAt: number;
    createAt: number;
}

export interface UserDoc extends IDocument {
    iLabXUserName: string
    phaseScore: Array<number>
}