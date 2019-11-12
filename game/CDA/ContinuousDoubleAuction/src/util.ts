export function getEnumKeys<E>(e: {}): Array<string> {
    const keys: Array<string> = [];
    for (let key in e) {
        if (typeof e[key] === 'number') {
            keys.push(key);
        }
    }
    return keys;
}

export function pointPair2Curve(p1: { price: number, p: number }, p2: { price: number, p: number }): (price: number) => number {
    const a = -2 * (p1.p - p2.p) / Math.pow(p1.price - p2.price, 3),
        b = -1.5 * (p1.price + p2.price) * a,
        c = 3 * p1.price * p2.price * a,
        d = p1.p - a * Math.pow(p1.price, 3) - b * Math.pow(p1.price, 2) - c * p1.price;
    return (price: number) => a * Math.pow(price, 3) + b * Math.pow(price, 2) + c * price + d;
}
