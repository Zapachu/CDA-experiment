export function getEnumKeys<E>(e: {}): Array<string> {
  const keys: Array<string> = []
  for (const key in e) {
    if (typeof e[key] === 'number') {
      keys.push(key)
    }
  }
  return keys
}
