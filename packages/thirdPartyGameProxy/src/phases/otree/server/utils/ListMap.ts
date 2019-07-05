const Expire = 30 * 24 * 60 * 60 * 1000

const ListMap: any = new Map()

ListMap.clean = () => {
    ListMap.forEach((value, key) => {
        if (Date.now() - value.lastTime > Expire) {
            ListMap.delete(key)
        }
    })
}

ListMap.getList = (namespace) => {
    let list = {data: [], lastTime: 0}
    if (ListMap.has(namespace)) {
        list = ListMap.get(namespace)
        list.lastTime = Date.now()
        ListMap.set(namespace, list)
    }
    ListMap.clean()
    console.log(list)
    return list.data
}

ListMap.setList = async (namespace, data) => {
    let list = {data, lastTime: Date.now()}
    ListMap.set(namespace, list)
    return true
}

export default ListMap
