import {registerOnFramework} from '@bespoke/register'
import {namespace} from '../config'
import {Play} from './Play'
import {Create} from './Create'
import {Play4Owner} from './Play4Owner'

registerOnFramework(namespace, {
    localeNames: ['连续竞价', 'CBM'],
    Create,
    Play,
    Play4Owner
})