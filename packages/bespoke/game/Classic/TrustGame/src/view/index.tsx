import {registerOnFramework} from 'bespoke-client-util'
import {Create} from './Create'
import {CreateOnElf} from './CreateOnElf'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('TrustGame', {
    localeNames: ['信任博弈', 'Trust Game'],
    Create,
    CreateOnElf,
    Play,
    Result,
})
