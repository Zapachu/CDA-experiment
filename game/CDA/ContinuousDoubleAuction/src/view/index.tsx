import { registerOnFramework } from '@bespoke/client'
import { namespace } from '../config'
import { Create } from './Create'
import { Play } from './Play'
import { Play4Owner } from './Play4Owner'
import { Result4Owner } from './Result4Owner'

registerOnFramework(namespace, {
  localeNames: ['连续双向拍卖', 'ContinuousDoubleAuction'],
  Create,
  Play,
  Play4Owner,
  Result4Owner
})
