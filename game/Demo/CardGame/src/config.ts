export const namespace = 'CardGame'

export enum GameType {
  LeftRight,
  Card
}

export enum MoveType {
  getRole = 'getRole',
  submitMove = 'submitMove',
  proceed = 'proceed'
}

export enum PushType {}

export enum FetchRoute {
  getRobotInputSeqList
}

export enum Role {
  A,
  B
}

export enum PlayerStatus {
  playing,
  waiting,
  result
}

export const cardGame = {
  cards: ['Joker', 'Ace', 'Two', 'Three'],
  roleName: {
    [Role.A]: 'Player1',
    [Role.B]: 'Player2'
  },
  outcomeMatrix4Player1: [
    [
      [1, -1],
      [-1, 1],
      [-1, 1],
      [-1, 1]
    ],
    [
      [-1, 1],
      [-1, 1],
      [1, -1],
      [1, -1]
    ],
    [
      [-1, 1],
      [1, -1],
      [-1, 1],
      [1, -1]
    ],
    [
      [-1, 1],
      [1, -1],
      [1, -1],
      [-1, 1]
    ]
  ]
}

export const LRGame = {
  options: ['Left', 'Right'],
  roleName: {
    [Role.A]: 'Seeker',
    [Role.B]: 'Hider'
  },
  outcomeMatrix4Player1: {
    small: [
      [
        [2.5, -2.5],
        [0, 0]
      ],
      [
        [0, 0],
        [0, 0]
      ]
    ],
    big: [
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [2.5, -2.5]
      ]
    ]
  }
}
