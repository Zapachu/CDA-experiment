import {Log} from '@elf/util';

export interface IPlayer {
    good?: number,
    sort: number[]
}

export function match(players: IPlayer[]): number[] {
    Log.d(players);
    const SIZE = players.length;
    const good2Player: number[] = Array(SIZE).fill(null),
        result: number[] = Array(SIZE).fill(null),
        allocatedGoods = new Set();
    players.forEach((player, i) => {
        if (player.good !== null) {
            good2Player[player.good] = i;
        }
        if (player.sort.length === 0 || player.sort[0] === player.good) {
            result[i] = player.good;
            allocatedGoods.add(player.good);
        }
    });
    while (allocatedGoods.size < players.length) {
        const playerIndex = result.findIndex(r => r === null);
        allocate4Player(playerIndex);
    }

    function allocate4Player(playerIndex: number, playerChain: number[] = []) {
        const player = players[playerIndex];
        let allocating = true;
        while (allocating) {
            const targetGood = player.sort.find(s => !allocatedGoods.has(s)),
                targetGoodOwnerIndex = good2Player[targetGood];
            let targetAvailable = false;
            if (targetGoodOwnerIndex === null || playerIndex === targetGoodOwnerIndex || playerChain.includes(targetGoodOwnerIndex)) {
                targetAvailable = true;
            } else {
                allocate4Player(targetGoodOwnerIndex, [...playerChain, playerIndex]);
                targetAvailable = !allocatedGoods.has(targetGood);
            }
            if (!targetAvailable) {
                continue;
            }
            const preGood = good2Player.findIndex(p => p === playerIndex);
            if (preGood !== null) {
                good2Player[preGood] = null;
                good2Player[targetGood] = playerIndex;
            }
            result[playerIndex] = targetGood;
            allocatedGoods.add(targetGood);
            allocating = false;
        }
    }

    return result;
}