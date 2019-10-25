type Key<T extends { [key: string]: string }> = {
    [P in keyof T]?: P
}

export const asset = {
    background: require('./sprites/bg.png'),
    player:require('./sprites/player.png'),
    harmful:require('./sprites/ashcan/harmful.png'),
    harmful_c:require('./sprites/ashcan/harmful_c.png'),
    kitchen:require('./sprites/ashcan/kitchen.png'),
    kitchen_c:require('./sprites/ashcan/kitchen_c.png'),
    other:require('./sprites/ashcan/other.png'),
    other_c:require('./sprites/ashcan/other_c.png'),
    recyclable:require('./sprites/ashcan/recyclable.png'),
    recyclable_c:require('./sprites/ashcan/recyclable_c.png'),
    dump01:require('./sprites/dump/dump01.png'),
};

export const assetName = (function getAssetName<T extends { [key: string]: string }>(assetMap: T): Key<T> {
    const result = {};
    Object.keys(assetMap).forEach(key => Object.assign(result, {[key]: key}));
    return result;
})(asset);
