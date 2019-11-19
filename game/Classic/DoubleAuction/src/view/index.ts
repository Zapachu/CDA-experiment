import { registerOnFramework } from '@bespoke/client'
import { namespace } from '../config'
import { Create } from '../../../CallAuction/src/view/Create'
import { Play } from './Play'
import { Result4Owner } from './Result4Owner'
import { Play4Owner } from './Play4Owner'

registerOnFramework(namespace, { Create, Play, Play4Owner, Result4Owner })
