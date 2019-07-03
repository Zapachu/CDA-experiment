import {registerOnFramework} from '@bespoke/client-sdk'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('TrustGame', {
    localeNames: ['信任博弈', 'Trust Game'],
    Create,
    Play,
    Result,
})
