import {createContext} from 'react'
import {baseEnum} from "@common"

export type TRootContext = Partial<{
    language: baseEnum.Language
}>

export const rootContext = createContext<TRootContext>({})