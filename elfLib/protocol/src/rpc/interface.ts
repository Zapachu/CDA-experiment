export namespace Linker {
    export namespace HeartBeat {
        export const intervalSeconds = 10
        export const key = namespace => `Linker:HeartBeat:${namespace}`

        export interface IHeartBeat {
            namespace: string
            jsUrl: string
        }
    }

    export namespace Create {
        export const name = namespace => `Linker:Create:${namespace}`

        export interface IReq {
            elfGameId: string
            owner: string
            params: any
        }

        export interface IRes {
            playUrl: string
        }
    }

    export namespace Result {
        export const name = 'Linker:Result'

        export interface IResult {
            uniKey?: string
            point?: number
            detailIframeUrl?: string
        }

        export interface IReq {
            elfGameId: string
            playerToken: string
            result?: IResult
        }

        export type IRes = null
    }
}

export namespace Trial {
    export namespace Create {
        export const name = (namespace: string) => `Trial:Create:${namespace}`

        export interface IReq {
        }

        export interface IRes {
            playUrl: string
        }
    }

    export namespace Done {
        export const name = 'Trial:Done'

        export interface IReq {
            namespace: string
            userId: string
            onceMore?: boolean
        }

        export interface IRes {
            lobbyUrl: string
        }
    }
}