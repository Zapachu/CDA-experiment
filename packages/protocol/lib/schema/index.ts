export * from './GameTemplate'
export * from './GameUserPermission'
import {model as mongooseModel, Model} from 'mongoose'
import {ElfGame} from './ElfGame'
import {ElfPlayer} from './ElfPlayer'
import {User} from './User'
import {GameUserPermission} from './GameUserPermission'
import {GameTemplate} from './GameTemplate'

const schemas = {
    ElfGame,
    ElfPlayer,
    User,
    GameUserPermission,
    GameTemplate
}

type TModels = { [P in keyof typeof schemas]?: Model<any> }

export function getModels(model: typeof mongooseModel): TModels {
    const models: TModels = {}
    for (let schemaName in schemas) {
        models[schemaName] = model(schemaName, schemas[schemaName])
    }
    return models
}