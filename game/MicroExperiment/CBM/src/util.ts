export function getEnumKeys<E>(e: {}): Array<string> {
  const keys: Array<string> = []
  for (const key in e) {
    if (typeof e[key] === 'number') {
      keys.push(key)
    }
  }
  return keys
}

export function random(min: number, max: number): number {
  return min + ~~(Math.random() * (max - min))
}

export function getBalanceIndex(countArr: number[]) {
  let s = countArr.reduce((m, n) => m + n, 0) / 2,
    i = 0
  while (s > 0) {
    s -= countArr[i++]
  }
  return i - 1
}
