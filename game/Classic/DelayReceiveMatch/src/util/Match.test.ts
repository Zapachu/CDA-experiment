import {IPlayer, match} from './Match';
import {Log} from '@elf/util';
import shuffle = require('lodash/shuffle');

for (let i = 20; i < 2e2; i++) {
    const groupSize = i,
        goodAmount = i + 10;
    let players: IPlayer[];
    players = shuffle(Array(groupSize).fill(null).map(() => ({
        sort: shuffle(Array(goodAmount).fill(null).map((_, i) => i))
    })));
    const result = match(players);
    Log.d(groupSize, goodAmount, result.filter(s => s !== null).length, result.sort((m, n) => (m - n)).toString());
}