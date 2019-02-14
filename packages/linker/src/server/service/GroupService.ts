import {IGroup, IGroupWithId} from '@common'
import {GroupModel} from '@server-model'

export class GroupService {
    static async saveGroup(group: IGroup): Promise<string> {
        const {id} = await new GroupModel(group).save()
        return id
    }

    static async getGroup(groupId: string): Promise<IGroupWithId> {
        const {id, gameId, title, desc, phaseConfigs, owner} = await GroupModel.findById(groupId)
        return {id, gameId, title, desc, phaseConfigs, owner}
    }
}