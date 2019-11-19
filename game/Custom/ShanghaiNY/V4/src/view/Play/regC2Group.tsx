import { Choice, Mode } from '../../config'

export function checkChoice({
  playersPerGroup,
  c1,
  c2,
  mode
}: {
  playersPerGroup: number
  c1: Choice
  c2: Array<Choice>
  mode: Mode
}): boolean {
  if (c1 === Choice.Null) {
    return false
  }
  const res4FirstCaseImpossible = c2.length === playersPerGroup + 1 && !c2.slice(1).includes(undefined),
    res4LastCaseImpossible = c2.length === playersPerGroup && !c2.includes(undefined)
  switch (mode) {
    case Mode.HR:
    case Mode.LR:
      return c1 === Choice.Wait ? res4LastCaseImpossible : res4FirstCaseImpossible
    case Mode.BR:
      return c1 === Choice.One ? res4FirstCaseImpossible : res4LastCaseImpossible
  }
}
