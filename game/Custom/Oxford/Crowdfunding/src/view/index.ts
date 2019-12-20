import { registerOnFramework } from '@bespoke/client'
import { Lang } from '@elf/component'
import { namespace } from '../config'
import { Create } from './Create'
import { Play } from './Play'
import { Play4Owner } from './Play4Owner'
import { Result } from './Result'

registerOnFramework(namespace, { Create, Play, Play4Owner, Result })

Lang.switchLang(Lang.Language.en)
