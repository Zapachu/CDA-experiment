import {registerOnFramework} from '@bespoke/client-sdk'
import {namespace} from '../config'
import {Play} from './Play'

registerOnFramework(namespace, {Play})