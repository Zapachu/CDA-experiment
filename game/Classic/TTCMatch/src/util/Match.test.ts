import {IPlayer, match} from './Match';
import {Log} from '@elf/util';
import shuffle = require('lodash/shuffle');

for (let groupSize = 20; groupSize < 2e2; groupSize++) {
    let players: IPlayer[];
    players = shuffle(Array(groupSize).fill(null).map((_, good) => {
        return {
            good,
            sort: Math.random() > .5 ? [] : shuffle(Array(groupSize).fill(null).map((_, i) => i))
        };
    }));
    const result = match(players);
    Log.d(result.toString(), result.sort((m, n) => (m - n)).toString() === Array(groupSize).fill(null).map((_, i) => i).toString());
}