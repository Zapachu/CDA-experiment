import {createContext} from 'react'
import {baseEnum} from "@core/common"

export type TRootContext = Partial<{
    language: baseEnum.Language
}>

export const rootContext = createContext<TRootContext>({})