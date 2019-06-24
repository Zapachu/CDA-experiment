export enum Phase {
    IPO_Median,
    IPO_TopK,
    TBM,
    CBM,
    CBM_Leverage
}

const NAMESPACE_PREFIX = 'stockTrade:'

export function phaseToNamespace(phase: Phase) {
    return `${NAMESPACE_PREFIX}${phase}`
}

export function namespaceToPhase(namespace: string): Phase {
    return +namespace.replace(NAMESPACE_PREFIX, '')
}