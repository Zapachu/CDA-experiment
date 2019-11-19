import { registerOnFramework } from '@bespoke/client'
import { namespace } from '../config'
import { Play } from '../../../CBM/src/view/Play'
import { Create } from '../../../CBM/src/view/Create'
import { Play4Owner } from '../../../CBM/src/view/Play4Owner'
import { Result4Owner } from '../../../CBM/src/view/Result4Owner'

registerOnFramework(namespace, {
  localeNames: ['融资融券', 'CBM with Leverage'],
  Create,
  Play,
  Play4Owner,
  Result4Owner
})
