import {registerOnFramework} from '@bespoke/client';
import {namespace} from '../config';
import {Create} from './Create';
import {Play} from './Play';
import {Result} from './Result';
import {Result4Owner} from './Result4Owner';
import {Play4Owner} from './Play4Owner';

registerOnFramework(namespace, {
    localeNames: ['上海纽约大学实验', 'Shanghai New York'],
    Create,
    Play,
    Result,
    Result4Owner,
    Play4Owner
});
