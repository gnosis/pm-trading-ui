import Gnosis from '@gnosis.pm/pm-js'
import olympiaArtifacts from '@gnosis.pm/olympia-token'
import { NETWORK_TIMEOUT } from 'store/actions/blockchain'
import { isFeatureEnabled } from 'utils/features'

const tournamentEnabled = isFeatureEnabled('tournament')

let gnosisInstance
let gnosisROInstance

export const {
  calcLMSRCost, calcLMSROutcomeTokenCount, calcLMSRMarginalPrice, calcLMSRProfit,
} = Gnosis

const addOlympiaContracts = async (gnosisJsInstance) => {
  await gnosisJsInstance.importContracts(olympiaArtifacts, {
    OlympiaToken: 'olympiaToken',
    AddressRegistry: 'olympiaAddressRegistry',
    RewardClaimHandler: 'rewardClaimHandler',
  })
}

/**
 * Initializes connection to GnosisJS
 * @param {*dictionary} GNOSIS_OPTIONS
 */
export const initGnosisConnection = async (GNOSIS_OPTIONS) => {
  try {
    gnosisInstance = await Gnosis.create(GNOSIS_OPTIONS)

    if (tournamentEnabled) {
      await addOlympiaContracts(gnosisInstance)
    }

    if (process.env.NODE_ENV === 'development') {
      window.gnosis = gnosisInstance
    }

    console.info('Gnosis Integration: connection established') // eslint-disable-line no-console
  } catch (err) {
    console.error('Gnosis Integration: connection failed') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
  }
}

export const initReadOnlyGnosisConnection = async (GNOSIS_OPTIONS) => {
  try {
    gnosisROInstance = await Gnosis.create(GNOSIS_OPTIONS)

    if (tournamentEnabled) {
      await addOlympiaContracts(gnosisROInstance)
    }

    if (process.env.NODE_ENV === 'development') {
      window.gnosisRO = gnosisROInstance
    }

    console.info('Gnosis RO Integration: connection established') // eslint-disable-line no-console
  } catch (err) {
    console.error('Gnosis RO Integration: connection failed') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
  }
}

/**
 * Returns an instance of the connection to GnosisJS
 */
export const getGnosisConnection = async () => {
  if (gnosisInstance) {
    return gnosisInstance
  }

  return new Promise((resolve, reject) => {
    let stillRunning = true
    const instanceCheck = setInterval(() => {
      if (gnosisInstance) {
        stillRunning = false
        clearInterval(instanceCheck)
        return resolve(gnosisInstance)
      }
    }, 50)

    setTimeout(() => {
      if (stillRunning) {
        clearInterval(instanceCheck)
        reject(new Error('Connection to Gnosis.js timed out'))
      }
    }, NETWORK_TIMEOUT)
  })
}

export const getROGnosisConnection = async () => gnosisROInstance || undefined

export default Gnosis
