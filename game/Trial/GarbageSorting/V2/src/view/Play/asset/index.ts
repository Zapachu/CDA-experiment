type Key<T extends { [key: string]: string }> = {
  [P in keyof T]?: P
}

export const asset = {
  background: require('./sprites/bg.png'),
  canAtlas: require('./sprites/can.json'),
  canTexture: require('./sprites/can.png'),
  playerDownAtlas: require('./sprites/playerDown.json'),
  playerDownTexture: require('./sprites/playerDown.png'),
  playerUpAtlas: require('./sprites/playerUp.json'),
  playerUpTexture: require('./sprites/playerUp.png'),
  btnSkip: require('./sprites/btnSkip.png'),
  garbageAtlas: require('./sprites/garbage.json'),
  garbageTexture: require('./sprites/garbage.png'),
  dumpAtlas: require('./sprites/dump.json'),
  dumpTexture: require('./sprites/dump.png'),
  TFAtlas: require('./sprites/TF.json'),
  TFTexture: require('./sprites/TF.png'),
  particle: require('./sprites/particle.png'),
  guideBg: require('./sprites/guideBg.png')
}

export const assetName = (function getAssetName<T extends { [key: string]: string }>(assetMap: T): Key<T> {
  const result = {}
  Object.keys(assetMap).forEach(key => Object.assign(result, { [key]: key }))
  return result
})(asset)
