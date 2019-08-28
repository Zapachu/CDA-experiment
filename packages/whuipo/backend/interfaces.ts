import { Document } from 'mongoose'
interface IDocument extends Document {
    updateAt: number;
    createAt: number;
}

export interface UserDoc extends IDocument {
    unionId: string,
    phaseScore: Array<number>
}