import PresupposedChoice from './PresupposedChoice'
import Choice from './Choice'
import Essay from './Essay'

export default {PresupposedChoice, Choice, Essay}

export type TQuestionProps = {
    seq : number
    label : string
    value: number & string & Array<string>
    handleInput:(value:any)=>void
}
