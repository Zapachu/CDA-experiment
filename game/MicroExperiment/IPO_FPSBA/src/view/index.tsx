import { registerOnFramework } from '@bespoke/client'
import { namespace } from '../config'
import { Play } from './Play'

registerOnFramework(namespace, {
  Play
})
