export const namespace = 'Crowdfunding';

export const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nullam eget felis eget nunc lobortis mattis. Venenatis urna cursus eget nunc scelerisque. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis. Sapien eget mi proin sed libero enim sed faucibus. Orci nulla pellentesque dignissim enim sit amet venenatis urna cursus. Sed velit dignissim sodales ut eu sem integer vitae justo. Massa sapien faucibus et molestie ac feugiat sed lectus. Non pulvinar neque laoreet suspendisse interdum consectetur libero. Consequat ac felis donec et odio pellentesque. Risus sed vulputate odio ut enim blandit volutpat maecenas volutpat. Ipsum nunc aliquet bibendum enim. Morbi tristique senectus et netus et malesuada. Ut placerat orci nulla pellentesque dignissim enim sit amet. Curabitur gravida arcu ac tortor dignissim convallis. Tempor orci eu lobortis elementum. Suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Cras fermentum odio eu feugiat pretium nibh ipsum consequat. Varius sit amet mattis vulputate enim nulla aliquet porttitor. Sed risus ultricies tristique nulla aliquet enim tortor at.'

export enum MoveType {
    login = 'login',
    username = 'username',
    contribute = 'contribute',
    toInstruction = 'toInstruction',
    toContribute = 'toContribute'
}

export enum PushType {
}

export interface IMoveParams {
    username: string
    p: number
    c: number
}

export interface IPushParams {
}

export interface ICreateParams {
    endowment: number
}

export interface IGameState {
    contribution: number[][]
}

export enum PlayerStatus {
    instruction,
    contribute,
    questionnaire
}

export enum Arm {
    Arm1 = 'Arm1',
    Arm2 = 'Arm2',
}

export enum Treatment {
    Baseline = 'Baseline',
    Probability = 'Probability',
    Uncertainty = 'Uncertainty',
    Statistics = 'Statistics'
}

export interface IPlayerState {
    status: PlayerStatus
    username: string
    login: number
    arm: Arm
    treatment: Treatment
    projectSort: number[]
}

export enum FetchRoute {
    logout = '/logout'
}

export enum Probability {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export interface IProjectConfig {
    name: string
    readMore: string
    threshold: number
    payoff: number
    fundProbability: Probability
    successRate: number
}

export const commonProjectConfig: Partial<IProjectConfig> = {
    threshold: 84,
    payoff: 30,
};

export const projectConfigs: IProjectConfig[] = [
    {
        name: 'Stroke',
        readMore: 'This project proposes a new drug to reduce the overall risk of recurrence of acute ischemic stroke. ',
        threshold: 84,
        payoff: 30,
        fundProbability: Probability.HIGH,
        successRate: 50
    },
    {
        name: 'Type-II Diabetes',
        readMore: 'This project proposes a new drug to reduce the overall risk of complications and mortality of people with Type-II Diabetes.',
        threshold: 72,
        payoff: 24,
        fundProbability: Probability.HIGH,
        successRate: 75
    },
    {
        name: 'Breast Cancer',
        readMore: 'This project proposes a new chemotherapy to reduce side effects of existing chemotherapy drugs.',
        threshold: 84,
        payoff: 24,
        fundProbability: Probability.HIGH,
        successRate: 25
    },
    {
        name: 'Cystic Fibrosis',
        readMore: 'This project proposes a new therapy to treat the underlying cause of Cystic Fibrosis. ',
        threshold: 72,
        payoff: 18,
        fundProbability: Probability.LOW,
        successRate: 50
    },
    {
        name: 'Obesity',
        readMore: 'This project proposes a new method to support overweight and obese people in reducing weight. ',
        threshold: 84,
        payoff: 18,
        fundProbability: Probability.MEDIUM,
        successRate: 75
    },
    {
        name: 'HIV',
        readMore: 'This project proposes a new vaccine for Human  Immunodeficiency Virus (HIV) which would  reduce the risk of transmission by 60%.',
        threshold: 72,
        payoff: 12,
        fundProbability: Probability.LOW,
        successRate: 25
    }
];
