import {Phase} from '@micro-experiment/share';

export const inProduction = process.env.NODE_ENV === 'production'

export const Config = {
    rootName: '',
    domain: 'microExperiment.cn',
    matchSeconds: 10,
    roomSize: 10,
};

export const PhaseScore = {
    [Phase.IPO]: 20,
    [Phase.OpenAuction]: 20,
    [Phase.TBM]: 20,
    [Phase.CBM]: 40,
};