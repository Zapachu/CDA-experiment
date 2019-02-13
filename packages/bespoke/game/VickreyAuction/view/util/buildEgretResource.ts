import * as resConfig from '../../resource/resMeta.json'
import {writeFileSync} from 'fs'

writeFileSync('./resMeta.ts',
    `export const resMeta = {
        name:'resMeta.json',
        path:require('../../resource/resMeta.json'),
        ${resConfig.groups.map(({name, keys}) => `${name}:{
            name:'${name}',
\t\t\t${keys.split(',').map(key => {
        const {name, url} = resConfig.resources.find(({name}) => name === key)
        return `${key}:{
                name:'${name}',
                path:require('../../resource/${url}')
            }`
    }).join(',\n\t\t\t')}
        }`).join(',\n\t\t')}
    }`
)

