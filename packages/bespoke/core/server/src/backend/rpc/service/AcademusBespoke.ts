import {Server} from 'grpc'
import {AcademusBespoke as A} from 'elf-protocol'
import {RedisKey, redisClient} from '../../util'

export function setBespokeService(server: Server) {
    function checkShareCode({request: {code}}: { request: A.TCheckShareCodeReq }, callback: A.TCheckShareCodeCallback): void {
        redisClient.get(RedisKey.share_CodeGame(code)).then(gameId => {
            callback(null, {gameId})
        })
    }

    A.setBespokeService(server, {checkShareCode})
}