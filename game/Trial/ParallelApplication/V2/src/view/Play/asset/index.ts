type Key<T extends { [key: string]: string }> = {
  [P in keyof T]?: P
}

export const asset = {}

export const assetName = (function getAssetName<T extends { [key: string]: string }>(assetMap: T): Key<T> {
  const result = {}
  Object.keys(assetMap).forEach(key => Object.assign(result, { [key]: key }))
  return result
})(asset)
