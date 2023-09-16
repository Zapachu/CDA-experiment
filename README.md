# ContinuousDoubleAuction

## About

An experiment set on continuous double auction, written in [TypeScript](https://www.typescriptlang.org).

## Experiments

- [CDASurvey](game%2FCDA%2FCDASurvey)
- [CognitiveReaction](game%2FCDA%2FCognitiveReaction)
- [ContinuousDoubleAuction](game%2FCDA%2FContinuousDoubleAuction)
- [EyeTest](game%2FCDA%2FEyeTest)
- [ReactionTest](game%2FCDA%2FReactionTest)

## Prepare
This project runs on [NodeJS v14+](https://nodejs.org) and uses [Mongodb](https://www.mongodb.com) and [Redis](https://redis.io) as the persistence layer, so we need to install them first.

Then start mongodb on default port `27017`，and redis on port `6379`.

## Install

```bash
npm install
```

## Start

Each sub-experiment is divided into two parts: the front-end and the back-end. When running the `npm run help` command, you will be guided to select which sub-experiment and which part. Once both the front-end and back-end of the sub-experiment have started, you can access it in a browser by visiting http://127.0.0.1:8080.

```bash
cd game
npm run help
```

