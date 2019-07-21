import {Cache} from './Cache'

export const cacheResult = (target, propertyName, descriptor)=>{
    const method = descriptor.value
    descriptor.value = async (...args) => {
        const cacheKey = `${propertyName}_${JSON.stringify(args)}`,
            cachedData = Cache.get(cacheKey)
        if (cachedData) {
            return Promise.resolve(cachedData)
        } else {
            const result = await method.apply(target, args)
            Cache.set(cacheKey, result)
            return result
        }
    }
    return descriptor
}

export const cacheResultSync = (target, propertyName, descriptor)=>{
    const method = descriptor.value
    descriptor.value = (...args) => {
        const cacheKey = `${propertyName}_${JSON.stringify(args)}`,
            cachedData = Cache.get(cacheKey)
        if (cachedData) {
            return cachedData
        } else {
            const result = method.apply(target, args)
            Cache.set(cacheKey, result)
            return result
        }
    }
    return descriptor
}