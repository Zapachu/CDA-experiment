import {createClient, CreateMode} from 'node-zookeeper-client'

const client = createClient('localhost:2181')

client.once('connected', () => {
    client.create('/hello', Buffer.from('hello world'), CreateMode.EPHEMERAL, (error, path) => {
        console.log(error, path)
        client.getData('/hello', (err, data) => console.log(err, data))
    })
    setTimeout(() => {
        console.log('close')
        client.close()
    }, 10000)
}).connect()