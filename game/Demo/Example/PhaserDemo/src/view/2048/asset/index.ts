type Key<T extends { [key: string]: string }> = {
  [P in keyof T]?: P
}

export const asset = {
  restart: require('./sprites/restart.png'),
  score: require('./sprites/score.png'),
  scoreBest: require('./sprites/score_best.png'),
  tiles: require('./sprites/tiles.png'),
  tileDefault: require('./sprites/tile_default.png'),
  grow: require('./sounds/grow.mp3'),
  move: require('./sounds/move.mp3')
}

export const assetName = (function getAssetName<T extends { [key: string]: string }>(assetMap: T): Key<T> {
  const result = {}
  Object.keys(assetMap).forEach(key => Object.assign(result, { [key]: key }))
  return result
})(asset)
