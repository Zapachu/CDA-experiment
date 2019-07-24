import {registerOnFramework} from '@bespoke/client'
import {namespace} from '../config'
import {Play} from './Play'
import {Create} from './Create'

registerOnFramework(namespace, {Play, Create})