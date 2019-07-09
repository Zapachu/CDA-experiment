import {registerOnFramework} from '@bespoke/register'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'

registerOnFramework(namespace, {
    Create,
    Play,
    Play4Owner
})
