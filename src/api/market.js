import Gnosis from '@gnosis.pm/pm-js/'
import { OUTCOME_TYPES } from 'utils/constants'
import { getGnosisConnection } from 'api'

export const resolveEvent = async (event, selectedOutcomeIndex) => {
  const gnosis = await getGnosisConnection()

  await gnosis.resolveEvent({ event: event.address, outcome: parseInt(selectedOutcomeIndex, 10) })
}

export const redeemWinnings = async (eventType, eventAddress) => {
  const gnosis = await getGnosisConnection()

  const eventContract = eventType === OUTCOME_TYPES.CATEGORICAL
    ? await gnosis.contracts.CategoricalEvent.at(eventAddress)
    : await gnosis.contracts.ScalarEvent.at(eventAddress)

  if (eventContract) {
    return Gnosis.requireEventFromTXResult(await eventContract.redeemWinnings(), 'WinningsRedemption')
  }
  throw new Error("Invalid Event - can't find the specified Event, invalid Eventtype?")
}
