import {colorConsole} from "tracer"

export namespace Log {
    let logger = colorConsole()

    export const l = logger.log
    export const i = logger.info
    export const d = logger.debug
    export const w = logger.warn
    export const e = logger.error
}