import {resolve} from 'path'
import {Server} from 'bespoke-server'
import Controller from '../../../Classic/TrustGame/src/Controller'

Server.start({
    staticPath: resolve(__dirname, '../dist')
}, {Controller})
