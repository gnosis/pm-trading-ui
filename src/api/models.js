const Contract = {
  address: undefined,
  creator: undefined,
  creationBlock: undefined,
  creationDate: undefined,
}

const Market = {
  ...Contract,
  local: true,
  netOutcomeTokensSold: [],
  funding: '0',
  fee: '0',
  stage: 1,
  marketMaker: undefined,
  marketFactory: undefined,
}

const Event = {
  ...Contract,
  local: true,
  collateralToken: undefined,
  isWinningOutcomeSet: false,
  type: undefined,
  lowerBound: undefined,
  upperBound: undefined,
}

const Oracle = {
  ...Contract,
  local: true,
  isOutcomeSet: false,
  owner: undefined,
}

const EventDescription = {
  ipfsHash: undefined,
  local: true,
  title: undefined,
  description: undefined,
  resolutionDate: undefined,
}

// Model Constructors

export const createLocalEventDescription = options => ({
  ...EventDescription,
  ...options,
})

export const createLocalOracle = options => ({
  ...Oracle,
  ...options,
})

export const createLocalEvent = options => ({
  ...Event,
  ...options,
})

export const createLocalMarket = options => ({
  ...Market,
  ...options,
})