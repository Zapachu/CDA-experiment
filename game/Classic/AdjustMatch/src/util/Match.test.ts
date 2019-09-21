import {IPlayer, match} from './Match';
import {Log} from '@elf/util';
import shuffle = require('lodash/shuffle');

for (let i = 20; i < 2e2; i++) {
    const groupSize = i;
    let players: IPlayer[];
    players = shuffle(Array(groupSize).fill(null).map((_, i) => {
        const old = Math.random() > .5,
            leave = old && Math.random() > .5;
        return {
            good: old ? i : null,
            sort: leave ? [] : shuffle(Array(groupSize).fill(null).map((_, i) => i))
        };
    }));
    const result = match(players);
    Log.d(result.toString(), result.sort((m, n) => (m - n)).toString() === Array(groupSize).fill(null).map((_, i) => i).toString());
}