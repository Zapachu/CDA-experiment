import * as objectHash from 'object-hash'

const gen32Token = (source) => {
    return objectHash(source, {algorithm: 'md5'})
}

export {
    gen32Token
}
