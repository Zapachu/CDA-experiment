import { Util } from '../src/Logic'

describe('Logic', () => {
  it('Util:getRandomApplications', () => {
    const applications = Util.getRandomApplications()
    expect(applications.length).toBe(3)
  })
})
