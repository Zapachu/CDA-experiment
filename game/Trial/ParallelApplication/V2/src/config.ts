export const namespace = 'ParallelApplicationV2'

export const CONFIG = {}

export enum MoveType {}

export enum PushType {}

export interface ICreateParams {}

export interface IMoveParams {}

export interface IPushParams extends IMoveParams, IPlayerState {}

export interface IGameState {}

export enum PlayerStatus {}

export interface IPlayerState {}
