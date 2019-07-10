import {registerOnFramework} from '@bespoke/register'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {Result} from './Result'
import {Result4Owner} from './Result4Owner'
import 'antd/dist/antd.css'

registerOnFramework(namespace, {
    Create,
    Play,
    Play4Owner,
    Result,
    Result4Owner
})
