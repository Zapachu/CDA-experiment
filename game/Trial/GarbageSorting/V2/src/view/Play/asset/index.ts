type Key<T extends { [key: string]: string }> = {
    [P in keyof T]?: P
}

export const asset = {
    background: require('./sprites/bg.png'),
    harmful: require('./sprites/ashcan/harmful.png'),
    harmful_c: require('./sprites/ashcan/harmful_c.png'),
    kitchen: require('./sprites/ashcan/kitchen.png'),
    kitchen_c: require('./sprites/ashcan/kitchen_c.png'),
    other: require('./sprites/ashcan/other.png'),
    other_c: require('./sprites/ashcan/other_c.png'),
    recyclable: require('./sprites/ashcan/recyclable.png'),
    recyclable_c: require('./sprites/ashcan/recyclable_c.png'),
    player01: require('./sprites/player/01.png'),
    player02: require('./sprites/player/02.png'),
    player03: require('./sprites/player/03.png'),
    player04: require('./sprites/player/04.png'),
    player05: require('./sprites/player/05.png'),
    player06: require('./sprites/player/06.png'),
    player11: require('./sprites/player/11.png'),
    player12: require('./sprites/player/12.png'),
    player13: require('./sprites/player/13.png'),
    player14: require('./sprites/player/14.png'),
    player15: require('./sprites/player/15.png'),
    player16: require('./sprites/player/16.png'),
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
