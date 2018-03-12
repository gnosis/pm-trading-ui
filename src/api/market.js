import Gnosis from '@gnosis.pm/gnosisjs/'
import { OUTCOME_TYPES } from 'utils/constants'
import * as api from './'

export const resolveEvent = async (event, selectedOutcomeIndex) => {
  const gnosis = await api.getGnosisConnection()

  await gnosis.resolveEvent({ event: event.address, outcome: parseInt(selectedOutcomeIndex, 10) })
}

export const redeemWinnings = async (eventType, eventAddress) => {
  const gnosis = await api.getGnosisConnection()

  const eventContract =
    eventType === OUTCOME_TYPES.CATEGORICAL
      ? await gnosis.contracts.CategoricalEvent.at(eventAddress)
      : await gnosis.contracts.ScalarEvent.at(eventAddress)

  if (eventContract) {
    return Gnosis.requireEventFromTXResult(await eventContract.redeemWinnings(), 'WinningsRedemption')
  }
  throw new Error("Invalid Event - can't find the specified Event, invalid Eventtype?")
}

export const withdrawFees = async (marketAddress) => {
  const gnosis = await api.getGnosisConnection()

  const marketContract = gnosis.contracts.Market.at(marketAddress)

  if (marketContract) {
    await marketContract.withdrawFees()
  }

  throw new Error("Invalid Market - can't find the specified Market")
}
