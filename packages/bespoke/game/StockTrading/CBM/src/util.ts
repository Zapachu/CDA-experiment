export function getEnumKeys<E>(e: {}): Array<string> {
    const keys: Array<string> = []
    for (let key in e) {
        if (typeof e[key] === 'number') {
            keys.push(key)
        }
    }
    return keys
}
