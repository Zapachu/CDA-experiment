import {IPlayer, match} from './Match';
import shuffle = require('lodash/shuffle');

test('Match', () => {
    for (let i = 20; i < 50; i++) {
        const groupSize = i,
            goodAmount = i + 10;
        let players: IPlayer[];
        players = shuffle(Array(groupSize).fill(null).map(() => ({
            sort: shuffle(Array(goodAmount).fill(null).map((_, i) => i))
        })));
        const result = match(players);
        expect(result.filter(s => s !== null).length).toBe(groupSize);
    }
});
