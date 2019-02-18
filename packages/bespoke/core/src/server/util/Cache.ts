import {config} from '@dev/common'

export interface CacheData{
    timestamp:number
    value:any
}

const cache:Map<string, CacheData> = new Map()

export class Cache{
    static set(key:string, value:any){
        cache.set(key, {
            timestamp:Date.now(),
            value
        })
    }

    static get(key:string):CacheData {
        const data = cache.get(key)
        if(!data){
            return null
        }
        if(Date.now() - data.timestamp > config.memoryCacheLifetime){
            cache.delete(key)
            return null
        }
        return data.value
    }
}