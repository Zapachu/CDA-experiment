type Key<T extends { [key: string]: string }> = {
  [P in keyof T]?: P
}

export const asset = {
  button: require('./sprite/button.png'),
  button2: require('./sprite/button2.png'),
  bootIntroBg: require('./sprite/bootIntroBg.png'),
  smileFace: require('./sprite/smileFace.png'),
  universityAtlas: require('./sprite/university.json'),
  universityTexture: require('./sprite/university.png'),
  matchAtlas: require('./sprite/match.json'),
  matchTexture: require('./sprite/match.png')
}

export const assetName = (function getAssetName<T extends { [key: string]: string }>(assetMap: T): Key<T> {
  const result = {}
  Object.keys(assetMap).forEach(key => Object.assign(result, { [key]: key }))
  return result
})(asset)
