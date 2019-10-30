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
    garbage01: require('./sprites/garbage/01.svg'),
    garbage02: require('./sprites/garbage/02.svg'),
    garbage03: require('./sprites/garbage/03.svg'),
    garbage04: require('./sprites/garbage/04.svg'),
    garbage05: require('./sprites/garbage/05.svg'),
    garbage06: require('./sprites/garbage/06.svg'),
    garbage07: require('./sprites/garbage/07.svg'),
    garbage08: require('./sprites/garbage/08.svg'),
    garbage09: require('./sprites/garbage/09.svg'),
    garbage10: require('./sprites/garbage/10.svg'),
    dumpAtlas: require('./sprites/dump.json'),
    dumpTexture: require('./sprites/dump.png'),
};

export const assetName = (function getAssetName<T extends { [key: string]: string }>(assetMap: T): Key<T> {
    const result = {};
    Object.keys(assetMap).forEach(key => Object.assign(result, {[key]: key}));
    return result;
})(asset);
