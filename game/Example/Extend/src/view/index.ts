import {registerOnFramework} from '@bespoke/register'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework(namespace, {Create, Play})