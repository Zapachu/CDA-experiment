import {resolve} from 'path'
import {copyFileSync} from 'fs-extra'

copyFileSync(resolve(__dirname, '../src/resource/public.scss'), resolve(__dirname, '../lib/public.scss'))