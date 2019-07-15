import {NetworkInterfaceInfo, networkInterfaces} from 'os'

export namespace NetWork {
    export function getIp() {
        let ip: string = '127.0.0.1'
        Object.values<NetworkInterfaceInfo[]>(networkInterfaces()).forEach(infos => {
            infos.forEach(({family, internal, address}) => {
                if (family === 'IPv4' && !internal) {
                    ip = address
                }
            })
        })
        return ip
    }
}